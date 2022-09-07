var mongoose = require("mongoose");
var User = mongoose.model("User");

module.exports.blockUnblockUser = function (req, res) {
  if (!req.body || !req.body.email || req.body.block === undefined) {
    res.status(403).json({
      message: "All fields required",
      response: "error",
    });
    return;
  }
  if (!req.payload._id) {
    res.status(401).json({
      response: "error",
      message: "UnauthorizedError: private profile",
    });
    return;

  } else {
    User.findOne({ email: req.body.email }).exec(function (err, user) {
      if (err) {
        res.status(403).json({
          response: "error",
          message: "no such technician found!",
        });
      }
      User.findOneAndUpdate(
        { email: req.body.email },
        { $set: { isBlocked: req.body.block } },
        { new: true },
        (err, user) => {

          if (err) {
            res.status(401).json({
              response: "error",
              message: "something went wrong!",
            });
          } else {
            var isBlocked = req.body.block ? "blocked" : "unblocked";
            res.status(200);
            res.json({
                message: "user has been " + isBlocked,
              response: "SUCCESS",
            });
          }
        }
      );
    });
  }
};
