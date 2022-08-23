var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var crypto = require('crypto');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.register = function(req, res) {

  if(!req.body || !req.body.emailToken || !req.body.password) {
    sendJSONresponse(res, 400, {
      "response": "error",
      "message": "All fields required"
    });
    return;
  }
  // console.log("request:" +req.body);
  User.findOne({emailToken: req.body.emailToken}, (err, user)=>{
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
      user.setPassword(req.body.password);
      user.isVerified = true;
      user.email = user.email;
        user.save(function(err) {
          if(err) {
          res.status(403);
          res.json({
              "response": null,
              "message": "something went wrong while adding user! please try again later"
          });
        }
          });
      User.findOneAndUpdate({emailToken: req.body.emailToken}, {...user}, {new: true}, (err, user) =>{
        console.log("err" + err);
      console.log("user2" + user);

        if(err) {
          console.log("err register:", err)
          res.status(401).json({
            "response": "error",
            "message": "something went wrong!"
          });
        } else {
        res.status(200);
        res.json({
          "response" : "user created successfully",
          "message": "SUCCESS"
        });
      }
    });
    }
  }
});
};

module.exports.login = function(req, res) {

  if(!req.body || !req.body.email || !req.body.password) {
    sendJSONresponse(res, 400, {
      "message": "All fields required"
      ,
      "response": "error",

    });
    return;
  }

  passport.authenticate('local', function(err, user, info){
    var token;

    // If Passport throws/catches an error
    if (err) {

      res.status(404).json(err);
      return;
    }
    console.log("logging in ",user.password)
    // If a user is found
    if(user){
      token = user.generateJwt();
      res.status(200);
      res.json({
      "response" : 
        {
        "token" : token,
        "data": {
          "tasks": user.assignedTasks
        }
        }
    });
    } else {
      // If user is not found
      res.status(403).json({"message": "incorrect credentials",
      "response": "error",});
    }
  })(req, res);
};