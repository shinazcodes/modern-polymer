var mongoose = require('mongoose');
var Purchase = mongoose.model('Purchase');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.purchase = async function(req, res) {
  console.log("here 1");

  if(!req.body || !req.body.itemId || !req.body.itemPrice) {
    sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
    return;
  }
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    try {
      var purchase = new Purchase();
      console.log("here 1" + req.body.toString());

      await purchase.setPurchase(req.payload._id, req.body);

      console.log("here 2");
      console.log(req);

    
      purchase.save(function(err) {
        if(!err) {
     res.status(200).json({
      "coinsEarned": purchase.coinsEarned
    });
  } else {
      res.status(401).json({
        "message": err
  });
}
});
  console.log(purchase);

      User
      .findById(req.payload._id)
      .exec(function(err, user) {

        console.log("user:" + user._id);
        User.findByIdAndUpdate(req.payload._id, {$set:{ coinsEarned: user.coinsEarned + purchase.coinsEarned}}, {new: true}, (err, doc) => {
          if (err) {
              console.log("Something wrong when updating data!");
          }
      
          console.log(doc);
      });
      });
     
    } catch {
      res.status(401).json({eror: "something went wrong"});

    }
   
  }
};