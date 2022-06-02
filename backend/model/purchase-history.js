var mongoose = require('mongoose');

var purchaseHistorySchema = new mongoose.Schema({
    _userId: {
        type: String,
        unique: true,
        required: true
    },
    purchaseHistory: [{
    itemId: {
    type: String,
    required: true
    }
    }, 
    {
    
    itemName: {
        type: String,
        required: true
    }
    }, {
    itemPrice: {
        type: Number,
        required: true
    }
    },{
    coinsEarned: {
        type: Number,
        required: false
    }}
  ]
});

purchaseSchema.methods.setPurchase = function (id, data) {
  this._userId = id;
  this.coinsEarned = data.itemPrice * 0.2;
  this.itemId = data.itemId;
  this.itemName = data.itemName;
  this.itemPrice = data.itemPrice;
};


mongoose.model('PurchaseHistory', purchaseHistorySchema);
