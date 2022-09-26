var passport = require('passport');
var mongoose = require('mongoose');
const {  checkLoginAccess } = require('../util/util');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.resetPassword = function(req, res) {

  if(!req.body || !req.body.password) {
    sendJSONresponse(res, 400, {
      "response": "error",
      "message": "All fields required"
    });
    return;
  }
  // console.log("request:" +req.body);
  User.findOne({phoneNumber: req.body.phoneNumber}, (err, user)=>{
    if(err) {
      res.status(401).json({
      "response": "error",
      "message": "user not found"});
    } else {

      // console.log("user1" + user);
      if(!user){
        res.status(401).json({
          "response": "error",
          "message": "somthing went wrong"
        });
      } else {
      
          user.setPassword(user, req.body.password, function(err, user) {
            if (err) {
              console.log(err)
              res.status(403)
              .json({"response": "error", message: err.message ? err.message : "Your password could not be reset." }) 
            } else {
                user.save(function(err1) {
                    if(!err1) {
                        res.status(401).json({
                            "response": "error",
                            "message": "something went wrong!"
                          });
                    } else {
                        res.status(200);
                        res.json({
                          "response" : "password reset successfully",
                          "message": "SUCCESS"
                        });
                    }
                    });
        
            }
          });
     
    }
  }
});
};
