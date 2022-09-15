var mongoose = require('mongoose');
const { checkAccess } = require('../util/util');
var User = mongoose.model('User');

module.exports.techniciansList = async function(req, res) {
  const check = await checkAccess(req,res)
  if(!check)
  return;
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
                            "phoneNumber": user.phoneNumber,
                            "alternatePhoneNumber": user.alternatePhoneNumber,
                            "isBlocked": user.isBlocked
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
