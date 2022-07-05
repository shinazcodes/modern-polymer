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
      var customer = new Customer();
      console.log("here 1" + req.body.toString());

      await customer.setCustomer(Math.floor(100000 + Math.random() * 900000), req.body);

      console.log("here 2");

    
      customer.save(function(err) {
        if(!err) {
            res.status(200).json({
              "response": "job created successfully!"
                });
        } else {
            res.status(401).json({
                "message": err
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


      const resp = await User.aggregate([
          {
              $match: { email: req.payload.assignedTo}
          },
         
      ]);
      
      console.log(resp);
      
      
       
      } catch {
        res.status(401).json({eror: "somethingsssss went wrong"});
  
      }
     
     
    } catch {
      res.status(401).json({eror: "something went wrong"});

    }
   
  }
};