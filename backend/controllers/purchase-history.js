var mongoose = require('mongoose');
var Purchase = mongoose.model('Purchase');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.purchaseHistory = async (req, res) => {
  console.log("here 1");

//   if(!req.body || !req.body.itemId || !req.body.itemPrice) {
//     sendJSONresponse(res, 400, {
//       "message": "All fields required"
//     });
//     return;
//   }
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    try {


    const resp = await Purchase.aggregate([
        {
            $match: { _purchaseId: req.payload._id}
        },
       
    ]);
    console.log(resp);
    res.status(200).json({
        "response": resp
      });
    console.log(res);
     
    } catch {
      res.status(401).json({eror: "somethingsssss went wrong"});

    }
   
  }
};