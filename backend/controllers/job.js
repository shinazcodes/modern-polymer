var mongoose = require('mongoose');
const { checkAccess } = require('../util/util');
var User = mongoose.model('User');

module.exports.profileRead =  async function(req, res) {
  const check = await checkAccess(req,res)
if(!check)
return;

  if (!req.payload._id) {
    res.status(401).json({
      "response": "error", "message" : "UnauthorizedError: private profile"
    });
  } else {
    User
      .findById(req.payload._id)
      .exec(function(err, user) {
        res.status(200).json(user);
      });
  }

};
