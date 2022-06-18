var mongoose = require('mongoose');

var purchaseSchema = new mongoose.Schema({
   _purchaseId: {
    type: String,
    required: true,
    unique:false
  },
    itemId: {
    type: String,
    required: true,
    unique:false
  },
  itemName: {
    type: String,
    required: true
  },
  itemPrice: {
    type: Number,
    required: true
  },
  coinsEarned: {
    type: Number,
    required: false
  },
});

purchaseSchema.methods.setPurchase = function (id, data) {
  this._purchaseId = id;
  this.coinsEarned = data.itemPrice * 0.2;
  console.log("here3   xx ");
  this.itemId = data.itemId;
  console.log("here3   yy ");
  this.itemName = data.itemName;
  console.log("here3   zz ");
  this.itemPrice = data.itemPrice;
  console.log("here3   aaaa ");
};


mongoose.model('Purchase', purchaseSchema);
