

var mongoose = require('mongoose');
const  ObjectID = require('mongodb').ObjectId;
var servicesSchema = new mongoose.Schema({
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

    }
  });
mongoose.model('Services', servicesSchema);

var invoiceDetailsSchema = new mongoose.Schema({
      name: {
      type: String,
      required: true,
      unique:false
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
    
        }
      }],
      required: false
    }
  });
  

  invoiceDetailsSchema.methods.setInvoice = function (data, array) {
    this.machine = data.machine;
    this.name = data.name;
    this.fullAddress = data.fullAddress;
    this.brand = data.brand;
    this.mobileNumber = data.mobileNumber;
    this.email = data.email;
    this.altMobileNumber = data.altMobileNumber;
    this.assignedTo = data.assignedTo;
    this.status = data.status;
    this.services = array

  };
  mongoose.model('Invoice', invoiceDetailsSchema);

  