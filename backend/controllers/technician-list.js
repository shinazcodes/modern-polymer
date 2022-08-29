var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.techniciansList = function(req, res) {

  if (!req.payload._id) {
    res.status(401).json({
      "response": "error", "message" : "UnauthorizedError: private profile"
    });
  } else {
    User
      .find({})
      .exec(function(err, user) {
        const orderID = req.query.dataType
          if(err){
              res.status(400).json({
                  "message": "sometihng went wrong",
      "response": "error",

              })
          } 
          if(orderID && orderID !== "full") {
            res.status(200).json({
                "response":
                    user.map((user)=>{
                        return {
                            "firstName": user.firstName,
                            "lastName": user.lastName,
                            "email": user.email,
                            "phoneNumber": user.phoneNumber
                        } 
                    })
                
            });

          } else {
            res.status(200).json({
                "response":
                    user
                
            });
          }
      });
  }

};
