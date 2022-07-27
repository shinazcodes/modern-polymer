var mongoose = require('mongoose');
var User = mongoose.model('User');
var Customer = mongoose.model('Customer');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.assignJob = async function(req, res) {
  console.log("here 1");

  if(!req.body || !req.body.technicianEmail || req.body.customer === undefined ) {
    sendJSONresponse(res, 400, {
      "message": "All fields required",
      "response": "error"
    });
    return;
  }
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile",
      "response": "error"

    });
  } else {
    try {
      User
      .findOne({email: req.body.technicianEmail})
      .exec(function(err, user) {
        if(!req.body.remove) {
        console.log("user:" + user._id);
        User.findOneAndUpdate({email: req.body.technicianEmail}, {$set:{ assignedTasks: [...user.assignedTasks, req.body.customer]}}, {new: true}, (err, doc) => {
          if (err) {
              console.log("Something wrong when updating data!");
          }
      });
    } else {
      User.findOneAndUpdate({email: req.body.technicianEmail}, {$set:{ assignedTasks: user.assignedTasks.filter((cust)=> cust.email !== req.body.customer.email)}}, {new: true}, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
     
    
    });
    }
      });
     
    } catch (error){
      console.log("technician update error", error);
      res.status(403).json({eror: "something went wrong"});

    }
    try {
     
    Customer
    .findOne({_customerId: req.body.customer._customerId})
    .exec(function(err, user) {

      console.log("user foundxxxxxxxx:" + user);
      Customer.findOneAndUpdate({_customerId: req.body.customer._customerId}, {$set:{ assignedTo: req.body.remove ? undefined : req.body.technicianEmail}}, {new: true}, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
      console.log("user foundyyyyyyyy:" + user);
      console.log("user techniiiiiii:" + req.body.technicianEmail);

        res.status(200).json({
          "response": "job assigned successfully!"
            });
    });
    });
   
    } catch {
    res.status(401).json({"response": "error", "message": "something went wrong"});

    }
   
  }
};