var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.register = function(req, res) {

  if(!req.body || !req.body.token || !req.body.password) {
    sendJSONresponse(res, 400, {
      "response": null,
      "message": "All fields required"
    });
    return;
  }
  console.log("request:" +req.body);
  User.findOne({emailToken: req.body.token}, (err, user)=>{
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
      user.setPassword(req.body.password);
      user.isVerified = true;
      user.emailToken = '';
      user.email = user.email;
      user.name = user.name;
      token = user.generateJwt();
      console.log("user2" + user);

      User.findOneAndUpdate({emailToken: req.body.token}, {...user}, {new: true}, (err, user) =>{
        console.log("err" + err);
        console.log("user" + user);
        if(err) {
          res.status(401).json({
            "response": null,
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
    console.log(user);
    // If a user is found
    if(user){
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);

};