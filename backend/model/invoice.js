

var mongoose = require('mongoose');
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
    fullAddress: {
        type: String,
        required: false
    },
    assignedTo: {
      type: String,
      required: false
    },
    custId: {
        type: String,
        required: false
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
    this.services = array;
    this.custId = data.custId;
    this.invoiceId = data.invoiceId;
    this.gst = data.gst;
    this.invoiceDate = data.invoiceDate;

  };
  mongoose.model('Invoice', invoiceDetailsSchema);

  