var mongoose = require('mongoose');
var crypto = require('crypto');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.otpVerification = function(req, res) {

  if(!req.body || !req.body.otpVerified || !req.body.phoneNumber) {
    sendJSONresponse(res, 400, {
      "response": null,
      "message": "All fields required"
    });
    return;
  }
  console.log("request otpVerified:" +req.body);
  User.findOne({phoneNumber: req.body.phoneNumber, otp: req.body.otp}, (err, user)=>{
    if(err) {
      res.status(401).json({
      "repsonse": null,
      "message": "user not found"});
    } else {
      console.log("user1" + user);
      if(!user){
        res.status(401).json({
          "response": null,
          "message": "somthing went wrong"
        });
      } else {
      user.isVerified = otpVerified;
      user.emailToken = crypto.randomBytes(64).toString('hex');  
      user.otp = '';
      user.phoneNumber = user.phoneNumber;
      user.name = user.name;
      console.log("user2" + user);

      User.findOneAndUpdate({phoneNumber: req.body.phoneNumber}, {...user}, {new: true}, (err, user) =>{
        console.log("err" + err);
        console.log("user" + user);
        if(err) {
          res.status(401).json({
            "response":null,
            "message": "something went wrong!"
          });
        } else {
        res.status(200);
        res.json({
          "response" : {
            "emailToken": user.emailToken
        },
          "message": "SUCCESS"
        });
      }
    });
    }
  }
});
};
