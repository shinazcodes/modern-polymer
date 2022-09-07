var mongoose = require('mongoose');
const { checkAccess } = require('../util/util');
var Invoice = mongoose.model('Invoice');

module.exports.getInvoices = async function(req, res) {
  const check = await checkAccess(req,res)
if(!check)
return;

  if (!req.payload._id) {
    res.status(401).json({
      "response": "error", "message" : "UnauthorizedError: private profile"
    });
  } else {
    Invoice
      .find({})
      .exec(function(err, invoice) {
          if(err){
              res.status(403).json({
                  "response": "error", "message": "sometihng went wrong"
              })
          } 
            res.status(200).json({
                "response": 
                    [...invoice]
                
            });
         
      });
  }

};
