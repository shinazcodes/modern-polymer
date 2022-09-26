var passport = require('passport');
var mongoose = require('mongoose');
const {  checkLoginAccess, checkAccess } = require('../util/util');
var User = mongoose.model('User');

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
      // user.setPassword(req.body.password);
      user.isVerified = true;
      user.email = user.email;a
      user.username = user.email;
      if(req.body.userType !== "admin") {
        user.approvedByAdmin = false;
      }
        // user.save(function(err) {
        //   if(err) {
        //   res.status(403);
        //   res.json({
        //       "response": null,
        //       "message": "something went wrong while adding user! please try again later"
        //   });
        // }
        //   });
          User.register(user, req.body.password, function(err, user) {
            if (err) {
              console.log(err)
              res.status(403)
              .json({"response": "error", message: err.message ? err.message : "Your account could not be saved." }) 
            } else {
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
                  "response" : "user created successfully! please wait for approval from admin to start using the app!",
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

module.exports.login = async function(req, res) {

  if(!req.body || !req.body.username || !req.body.password) {
    sendJSONresponse(res, 400, {
      "message": "All fields required"
      ,
      "response": "error",

    });
    return;
  }
 
  const check = await checkLoginAccess(req.body.username,res);
  if(!check)
  return;
  
  passport.authenticate('local', function (err, user, info) { 
    
    if(err){
      res.status(403).json({"message": "incorrect credentials",
      "response": "error",})
    } else{
     if (!user) {
       res.status(403).json({"response": "error", message: 'username or password incorrect'})
     } else{
       req.login(user, function(err){
         if(err){
          res.status(403).json({"message": "incorrect credentials",
          "response": "error",});
         }else{
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
         }
       })
     }
    }
 })(req, res);

 
};


module.exports.onboardTechnician = async function(req, res) {
  const check = await checkAccess(req,res)
  if(!check)
  return;
  if(!req.body || !req.body.phoneNumber) {
    sendJSONresponse(res, 400, {
      "message": "All fields required"
      ,
      "response": "error",

    });
    return;
  }
 


  User.findOne({ phoneNumber: req.body.phoneNumber }).exec(
    function (err, tech) {
      //removing other technicians assigned job if it is assigned and is not the same technician
        User.findOneAndUpdate(
          { phoneNumber: req.body.phoneNumber },
          {
            $set: {
              approvedByAdmin: true
            },
          },
          { new: true },
          (err1, doc) => {
            if (err1 || !doc) {
              res.status(403).json({
                "response": "error",
              "message": "something went wrong"
                            });
            } else if(doc) {
              res.status(200).json({
              "response": "the technician has been verified and onboarded to hometech successfully!"});
            }
          }
        );
      }
  );

 
};