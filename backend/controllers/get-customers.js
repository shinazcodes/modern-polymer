var mongoose = require('mongoose');
var Customers = mongoose.model('Customer');

module.exports.getCustomers = function(req, res) {

  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    Customers
      .find({})
      .exec(function(err, customer) {
          if(err){
              res.status(400).json({
                  "message": "sometihng went wrong"
              })
          } 
            res.status(200).json({
                "response":
                    customer.map((customer)=>
                         customer
                        
                    )
                
            });

          
      });
  }

};
