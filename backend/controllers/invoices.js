var mongoose = require('mongoose');
var Invoice = mongoose.model('Invoice');

module.exports.getInvoices = function(req, res) {

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
