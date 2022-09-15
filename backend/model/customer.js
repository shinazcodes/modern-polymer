var mongoose = require('mongoose');


var customerSchema = new mongoose.Schema({
   _customerId: {
    type: String,
    required: true,
    unique:true
  },
  dateCreated: {
    type: String,
    required: false,
  },
  dateAssigned: {
    type: String,
    required: false,
  },
  dateStarted: {
    type: String,
    required: false,
  },
  dateCompleted: {
    type: String,
    required: false,
  },
    name: {
    type: String,
    required: true,
    unique:false
  },
  fullAddress: {
    type: String,
    required: false
},
  email: {
    type: String,
    required: true
  },
   mobileNumber: {
    type: Number,
    required: true
  },
  altMobileNumber: {
    type: Number,
    required: false
  },
  machine: {
    type: String,
    required: false
  },
  brand: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: false
  },
  assignedTo: {
    type: String,
    required: false
  },
  cancelReason:{
    type: String,
    required: false
  },
  invoiceDetails: {
    type:{
      name: {
      type: String,
      required: true,
      unique:false
    },
    approved: {
      default: false,
      type: Boolean,
      required: false
    },
    invoiceId:{
      type: String,
      required: false,
    },
    invoiceDate:{
      type: String,
      required: false,
    },
    gst:{
      type: Number,
      required: false,
    },
    email: {
      type: String,
      required: true
    },
     mobileNumber: {
      type: Number,
      required: true
    },
    fullAddress: {
        type: String,
        required: false
    },
    assignedTo: {
      type: String,
      required: false
    },
    services: {
      type: [{
        name: {
          type: String,
        required: false,
    
        },
        quantity: {
          type: String,
        required: false,
    
        },
        price: {
          type: String,
        required: false,
    
        },
        gst:{
          type: Number,
          required: false,
        },
      }],
      required: false
    }
  },
    required: false
  },
});


//todo make sure this id is unique
customerSchema.methods.setCustomer = function (id, data) {
  this._customerId = id;
  this.machine = data.machine;
  this.name = data.name;
  this.fullAddress = data.fullAddress;
  this.brand = data.brand;
  this.mobileNumber = data.mobileNumber;
  this.email = data.email;
  this.altMobileNumber = data.altMobileNumber;
  this.assignedTo = data.assignedTo;
  this.status = data.status;
  this.dateCreated = new Date().toLocaleString();
};

mongoose.model('Customer', customerSchema);
