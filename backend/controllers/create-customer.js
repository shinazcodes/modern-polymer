var mongoose = require('mongoose');
var Customer = mongoose.model('Customer');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.createCustomer = async function(req, res) {
  console.log(req.body);

  if(!req.body || !req.body.machine || !req.body.email) {
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
      var customer = new Customer();
      console.log("here 1" + req.body.toString());

      await customer.setCustomer(Math.floor(100000 + Math.random() * 900000), req.body);

      console.log("here 2");

    
      customer.save(function(err) {
        if(!err) {
        //   User.findOneAndUpdate({email: req.body.assignedTo}, {...user, assignedTasks: [...user.assignedTasks, customer._customerId]}, {new: true}, (err, user) =>{
        //     console.log("err" + err);
        //     console.log("user")
        //     console.log(user); 
        //     // if(err) {
        //     //   console.log("err register:", err)
        //     //   res.status(401).json({
        //     //     "response": null,
        //     //     "message": "something went wrong!"
        //     //   });
        //     // } else {
        //     // res.status(200);
        //     // res.json({
        //     //   "response" : "user created successfully",
        //     //   "response": "error", "message": "SUCCESS"
        //     // });
        //   // }
        // });
        console.log(req.body.assignedTo)
        User
          .findOne({email: req.body.assignedTo})
          .exec(function(err, user) {
          
            User.findOneAndUpdate({email: req.body.assignedTo}, {$set:{assignedTasks: [...user.assignedTasks, customer]}}, {new: true}, (err, doc) => {
              if (err) {
                  console.log("Something wrong when updating data!");
                  // res.status(401).json({
                  //   "response": "error", "message": err
                  // });
                }
          // console.log({...user, assignedTasks: [...user.assignedTasks, customer._customerId]})
          // user.save();

              console.log("hi");
              console.log(doc);
              // console.log(doc.email);
          });
          });
            res.status(200).json({
              "response": "job created successfully!"
                });
        } else {
            res.status(401).json({
                "response": "error", "message": err
              });
        }
    });
    console.log(customer);

    //   User
    //   .findById(req.payload._id)
    //   .exec(function(err, user) {

    //     console.log("user:" + user._id);
    //     User.findByIdAndUpdate(req.payload._id, {$set:{ coinsEarned: user.coinsEarned + purchase.coinsEarned}}, {new: true}, (err, doc) => {
    //       if (err) {
    //           console.log("Something wrong when updating data!");
    //       }
      
    //       console.log(doc);
    //   });
    //   });
    try {


      // const resp = await User.aggregate([
      //     {
      //         $match: { email: req.body.assignedTo}
      //     },
         
      // ]);
      // console.log("find tech");
      // console.log(resp);
      
     
       
      } catch (err) {
        res.status(401).json({      "response": "error", "message" : "something went wrong"
      });
  
      }
     
     
    } catch {
      res.status(401).json({      "response": "error", "message" : "something went wrong"
      });

    }
   
  }
};