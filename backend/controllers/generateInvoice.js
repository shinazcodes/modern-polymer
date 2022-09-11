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
          gst: req.body.invoiceDetails.gst,
          
        };
        var inv = new Invoice();
        inv.setInvoice(invoice, [...serviceArray]);
        
        // services.name = req.body.invoiceDetails.services.name;
        // services.quantity = req.body.invoiceDetails.services.quantity;
        // services.price = req.body.invoiceDetails.services.price;
        console.log("serviuces", invoice)
        inv.save(function(err) {
         
          console.log("sdfgsfggferrr", err)
          console.log("sfgsggfs", invoice)
          
          });
     

          Customer.findOneAndUpdate({_customerId: req.body.invoiceDetails._customerId}, {$set:{ invoiceDetails: invoice}}, {new: true}, (err, doc) => {
            if (err) {
                console.log("Something wrong when updating data!");
            }
          console.log("sfgsggfs", doc)
            
            res.status(200).json({
              "response": "invoice created successfully!"
                });
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
      .exec(function(err, user) {
          if(err || !user){
              res.status(403).json({
                  "response": "error", 
                  "message": "sometihng went wrong"
              })
          } 
          console.log(user)
          var invoiceDetails = {...user.invoiceDetails, approved: true}

          Customer.findOneAndUpdate({_customerId: req.body._customerId}, {$set:{ invoiceDetails: invoiceDetails}}, {new: true}, (err, doc) => {
            if (err) {
                console.log("Something wrong when updating data!");
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

          Customer.findOneAndUpdate({_customerId: req.body._customerId}, {$set:{ dateCompleted: Date.now(), status: "completed"}}, {new: true}, (err, doc) => {
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
                  taskToUpdate[0].dateCompleted = Date.now(),
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