var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.getTechnician = function(req, res) {

  if (!req.payload._id) {
    res.status(401).json({
      "response": "error", "message" : "UnauthorizedError: private profile"
    });
  } else {
    User
      .findOne({email: req.body.email})
      .exec(function(err, user) {
        const orderID = req.query.dataType
          if(err){
              res.status(403).json({
                  "response": "error", "message": "sometihng went wrong"
              })
          } 
            res.status(200).json({
                "response": 
                    user
                
            });
         
      });
  }

};
