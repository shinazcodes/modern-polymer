var mongoose = require("mongoose");
var User = mongoose.model("User");

module.exports.checkAccess = async function (req, res) {
  return new Promise(function (resolve, reject) {
    User.findOne({ email: req.payload.email }).exec(async function (err, user) {
      if (err) {
        res.status(401).json({
          response: "error",
          message: "unauthorized",
        });
        resolve(false);
      } else if (user && user.isBlocked) {
        res.status(401).json({
          response: "error",
          message: "unauthorized",
        });
        resolve(false);
      }  else if (user && !user.approvedByAdmin) {
        res.status(401).json({
          response: "error",
          message: "please wait for verification and approval from admin to start using your account",
        });
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

module.exports.checkLoginAccess = async function (username, res) {
  return new Promise(function (resolve, reject) {
    User.findOne({ email: username }).exec(function (err, user) {
      if (err) {
        res.status(401).json({
          response: "error",
          message: "unauthorized",
        });
        resolve(false);
      } else if (user && user.isBlocked) {
        res.status(401).json({
          response: "error",
          message: "your account is temporarily disabled",
        });
        resolve(false);
      }
      else if (user && !user.approvedByAdmin) {
        res.status(401).json({
          response: "error",
          message: "please wait for verification and approval from admin to start using your account",
        });
        resolve(false);
      } 
      else {
        resolve(true);
      }
    });
  });
};
