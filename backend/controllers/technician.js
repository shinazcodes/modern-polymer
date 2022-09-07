var mongoose = require('mongoose');
const { checkAccess } = require('../util/util');
var User = mongoose.model('User');

module.exports.getTechnician =  async function(req, res) {
  const check = await checkAccess(req,res)
  if(!check)
  return;

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

module.exports.removeTechnician = function(req, res) {

  if (!req.payload._id) {
    res.status(401).json({
      "response": "error", "message" : "UnauthorizedError: private profile"
    });
  } else {
    User
      .findOne({email: req.body.email})
      .exec(function(err, user) {
        if(err){
          res.status(403).json({
              "response": "error", "message": "no such technician found!"
          })
      } 
        User.deleteOne({email: req.body.email}).exec(function(err, user) {
          const orderID = req.query.dataType
            if(err){
                res.status(403).json({
                    "response": "error", "message": "sometihng went wrong while deleting the technician!"
                })
            } 
              res.status(200).json({
                  "response": 
                      user
                  
              });
           
        });
          
            
         
      });
  }

};
