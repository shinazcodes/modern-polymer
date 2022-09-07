var mongoose = require('mongoose');
const { checkAccess } = require('../util/util');
var Customers = mongoose.model('Customer');

module.exports.getCustomers = async function(req, res) {
    const check = await checkAccess(req,res)
  if(!check)
  return;

  if (!req.payload._id) {
    res.status(401).json({
      "response": "error", "message" : "UnauthorizedError: private profile"
    });
  } else {
    Customers
      .find({})
      .exec(function(err, customer) {
          if(err){
              res.status(400).json({
                  "message": "sometihng went wrong",
      "response": "error",

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
