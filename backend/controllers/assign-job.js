var mongoose = require('mongoose');
var User = mongoose.model('User');
var Customer = mongoose.model('Customer');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.assignJob = async function(req, res) {
  console.log("here 1");

  if(!req.body || !req.body.technicianId || !req.body.customerId ) {
    sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
    return;
  }
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    try {
     
  
  console.log(purchase);

      User
      .findById(req.body.technicianId)
      .exec(function(err, user) {

        console.log("user:" + user._id);
        User.findByIdAndUpdate(req.body.technicianId, {$set:{ assignedTasks: [...user.assignedTasks, req.body.customerId]}}, {new: true}, (err, doc) => {
          if (err) {
              console.log("Something wrong when updating data!");
          }
      
          console.log(doc);
      });
      });
     
    } catch {
      res.status(401).json({eror: "something went wrong"});

    }
    try {
     
    Customer
    .findById(req.body.customerId)
    .exec(function(err, user) {

      console.log("user:" + user._id);
      User.findByIdAndUpdate(req.body.customerId, {$set:{ assignedTo: req.body.technicianId}}, {new: true}, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
    
        console.log(doc);
    });
    });
   
    } catch {
    res.status(401).json({eror: "something went wrong"});

    }
   
  }
};