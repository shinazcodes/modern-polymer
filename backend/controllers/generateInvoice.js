var mongoose = require('mongoose');
var Customer = mongoose.model('Customer');
var Services = mongoose.model('Services');
var Invoice = mongoose.model('Invoice');
var User = mongoose.model('User');
const { checkAccess } = require('../util/util');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};
module.exports.generateInvoice = async function(req, res) {
  const check = await checkAccess(req,res)
  if(!check)
  return;
  if(!req.body || !req.body.invoiceDetails.name || !req.body.invoiceDetails.fullAddress) {
    sendJSONresponse(res, 400, {
      "message": "All fields required",
      "response": "error",

    });
    return;
  }
  if (!req.payload._id) {
    res.status(401).json({
      "response": "error", "message" : "UnauthorizedError: private profile"
    });
  } else {
    try {
    
        
        const serviceArray = [];
        for(var i=0;i<req.body.invoiceDetails.services.length; i++){
          var services = {
            name: req.body.invoiceDetails.services[i].name,
            quantity: req.body.invoiceDetails.services[i].quantity,
            price: req.body.invoiceDetails.services[i].price,
            gst: req.body.invoiceDetails.services[i].gst,

          };
          serviceArray.push(services)
        }
        var invoice = {
          name: req.body.invoiceDetails.name,
          fullAddress: req.body.invoiceDetails.fullAddress,
          mobileNumber: req.body.invoiceDetails.mobileNumber,
          email: req.body.invoiceDetails.email,
          assignedTo: req.body.invoiceDetails.assignedTo,
          services: serviceArray,
          custId: req.body.invoiceDetails._customerId,
          invoiceId: "#PAY" + Math.floor(100000 + Math.random() * 900000),
          invoiceDate: req.body.invoiceDetails.invoiceDate,
          approved: false
          
        };
        var inv = new Invoice();
        inv.setInvoice(invoice, [...serviceArray]);
        
        // services.name = req.body.invoiceDetails.services.name;
        // services.quantity = req.body.invoiceDetails.services.quantity;
        // services.price = req.body.invoiceDetails.services.price;
        console.log("serviuces", invoice)
        Invoice.findOne({custId: req.body.invoiceDetails._customerId}, (err, invoice)=>{
          if(err || !!!invoice){
          inv.save(function(error) {
         
            console.log("sdfgsfggferrr", error)
            console.log("invoice created and saved", invoice)

            
            });

          } else {
            for (var id in req.body.invoiceDetails ){
              invoice[id]= req.body.invoiceDetails[id];
          }
            invoice.save( function(err){
          });
          }

        });
    
     

          Customer.findOneAndUpdate({_customerId: req.body.invoiceDetails._customerId}, {$set:{ invoiceDetails: invoice}}, {new: true}, (err, customer) => {
            if (err) {
                console.log("Something wrong when updating data!");
                res.status(403).json({      "response": "error", 
                "message" : "something went wrong"
                });
            } else {
          console.log("custtt", customer)
          User
          .findOne({email: req.body.invoiceDetails.assignedTo})
          .exec(function(error1, user) {
          otherTasks = user.assignedTasks.filter((item)=> item._customerId !== req.body.invoiceDetails._customerId);
          taskToUpdate = user.assignedTasks.filter((item)=> item._customerId === req.body.invoiceDetails._customerId);
          taskToUpdate[0].invoiceDetails = invoice;
          User.findOneAndUpdate({email:req.body.invoiceDetails.assignedTo}, {$set:{ assignedTasks: [...taskToUpdate, ...otherTasks]}}, {new: true}, (error, tech) => {
             if (error1) {
                console.log("Something wrong when updating    data!");
                res.status(403).json({      "response": "error", 
                "message" : "something went wrong"
                });
            } else {
          console.log("techni", tech)
            
            res.status(200).json({
              "response": "invoice created successfully!"
                });
            }

        });
    });

      }
           
        });
    } catch(err) {
      console.log("err", err);
      res.status(403).json({      "response": "error", 
      "message" : "something went wrong"
      });

    }
   
  }
};


module.exports.getInvoice = async function(req, res) {
  console.log(req.body);
    const check = await checkAccess(req,res)
  if(!check)
  return;

  if(!req.body || !req.body._customerId ) {
    sendJSONresponse(res, 400, {
      "message": "All fields required",
      "response": "error",

    });
    return;
  }
  if (!req.payload._id) {
    res.status(401).json({
      "response": "error", "message" : "UnauthorizedError: private profile"
    });
  } else {
    try {
    
     Customer
      .findOne({_customerId: req.body._customerId})
      .populate('Invoice')
      .exec(function(err, user) {
          if(err){
              res.status(403).json({
                  "response": "error", 
                  "message": "sometihng went wrong"
              })
          } 
          console.log("user", user);
          // console.log("invoiceDetails", user.invoiceDetails);
         
            res.status(200).json({
                "response":{
                                "customer": user

                            }
         
      });
    });
  } catch {
      res.status(403).json({      "response": "error", 
      "message" : "something went wrong"
      });

    }
   
  }
};

module.exports.approveInvoice = async function(req, res) {
  console.log(req.body);
    const check = await checkAccess(req,res)
  if(!check)
  return;

  if(!req.body || !req.body._customerId ) {
    sendJSONresponse(res, 400, {
      "message": "All fields required",
      "response": "error",

    });
    return;
  }
  if (!req.payload._id) {
    res.status(401).json({
      "response": "error", "message" : "UnauthorizedError: private profile"
    });
  } else {
    try {
      Customer
      .findOne({_customerId: req.body._customerId})
      .exec(function(err, user1) {
          if(err || !user1){
              res.status(403).json({
                  "response": "error", 
                  "message": "sometihng went wrong"
              })
          } 
          console.log(user1)
          var invoiceDetails = {...user1.invoiceDetails, approved: true}
        
          Customer.findOneAndUpdate({_customerId: req.body._customerId}, {$set:{ invoiceDetails: invoiceDetails}}, {new: true}, (err, doc) => {
            if (err) {
                console.log("Something wrong when updating data!");
            } else {
              console.log("sfgsggfs", doc);
            
              User
                .findOne({email: doc.assignedTo})
                .exec(function(err, user) {
                  var found = false;
                  otherTasks = user.assignedTasks.filter((item)=> item._customerId !== req.body._customerId);
                  taskToUpdate = user.assignedTasks.filter((item)=> item._customerId === req.body._customerId);
                  taskToUpdate[0].invoiceDetails.approved = true;
                  User.findOneAndUpdate({email: doc.assignedTo}, {$set:{ assignedTasks: [...taskToUpdate, ...otherTasks]}}, {new: true}, (err, doc) => {
                    if (err) {
                        console.log("Something wrong when updating data!");
                    } else {
          
                    }});   
                  });       

              Invoice.findOneAndUpdate({custId: req.body._customerId}, {$set:{ approved: true}}, {new: true}, (err, doc1) => {
                if(doc1){
                  res.status(200).json({
                    "response": "invoice approved!"
                      });
                } else {
                  res.status(403).json({      "response": "error", 
                  "message" : "something went wrong"
                  });
                }
              });
            }
        
              });
            });
  } catch {
      res.status(403).json({      "response": "error", 
      "message" : "something went wrong"
      });

    }
   
  }
};



module.exports.completeTask = async function(req, res) {
    const check = await checkAccess(req,res)
  if(!check)
  return;

  if(!req.body || !req.body._customerId || !req.body.technicianEmail) {
    sendJSONresponse(res, 400, {
      "message": "All fields required",
      "response": "error",

    });
    return;
  }
  if (!req.payload._id) {
    res.status(401).json({
      "response": "error", "message" : "UnauthorizedError: private profile"
    });
  } else {
    try {
      Customer
      .findOne({_customerId: req.body._customerId})
      .exec(function(err, customer) {
          if(err || !customer){
              res.status(403).json({
                  "response": "error", 
                  "message": "sometihng went wrong"
              })
          } 
          console.log(customer)

          Customer.findOneAndUpdate({_customerId: req.body._customerId}, {$set:{ dateCompleted: new Date().toLocaleString(), status: "completed"}}, {new: true}, (err, doc) => {
            if (err) {
                console.log("Something wrong when updating data!");
            } else {


                User
                .findOne({email: req.body.technicianEmail})
                .exec(function(err, user) {
                  var found = false;
                  otherTasks = user.assignedTasks.filter((item)=> item._customerId !== req.body._customerId);
                  taskToUpdate = user.assignedTasks.filter((item)=> item._customerId === req.body._customerId);
                  taskToUpdate[0].status = "completed";
                  taskToUpdate[0].dateCompleted = new Date().toLocaleString(),
                  User.findOneAndUpdate({email: req.body.technicianEmail}, {$set:{ assignedTasks: [...taskToUpdate, ...otherTasks]}}, {new: true}, (err, doc) => {
                    if (err) {
                        console.log("Something wrong when updating data!");
                    } else {
          
                    }});   
                  });       


            }
          console.log("sfgsggfs", doc)
            
            res.status(200).json({
              "response": "invoice approved!"
                });
              });
            });
  } catch {
      res.status(403).json({      "response": "error", 
      "message" : "something went wrong"
      });

    }
   
  }
};