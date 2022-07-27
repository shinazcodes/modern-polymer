var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.techniciansList = function(req, res) {

  if (!req.payload._id) {
    res.status(401).json({
      "response": "error", "message" : "UnauthorizedError: private profile"
    });
  } else if(req.body.id){
    res.status(403).json({
        "response": "error", "message" : "data unavailable"
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
                    user.map((user)=>{
                        return {
                            "data": {
                                "tasks": user.assignedTasks
                              }
                        } 
                    })
                
            });

         
      });
  }

};
