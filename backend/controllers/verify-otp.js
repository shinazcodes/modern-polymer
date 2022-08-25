var mongoose = require('mongoose');
var crypto = require('crypto');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.verifyOtp = function(req, res) {

  if(!req.body || !req.body.otp || !req.body.email) {
    sendJSONresponse(res, 400, {
      "response": "error",
      "message": "All fields required"
    });
    return;
  }
  console.log("request otp:" +req.body);
  User.findOne({email: req.body.email, otp: req.body.otp}, (err, user)=>{
    if(err) {
      res.status(401).json({
      "response": "error", "message": "user not found"});
    } else {
      console.log("user1" + user);
      if(!user){
        res.status(401).json({
          "response": "error", "message": "somthing went wrong"
        });
      } else {
      user.otp = '';
      user.email = user.email;
      user.name = user.name;
      console.log("user2" + user);

      User.findOneAndUpdate({email: req.body.email, otp: req.body.otp}, {...user}, {new: true}, (err, user) =>{
        console.log("err" + err);
        console.log("user" + user);
        if(err) {
          res.status(401).json({
            "response":"error",
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
