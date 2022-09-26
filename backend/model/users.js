var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
  
var passportLocalMongoose = require('passport-local-mongoose');
  
var userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  isBlocked: {
    type: Boolean,
    required: false,
    default: false
  },
  username: {
    type: String,
    required: false
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  adharNumber:{
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  streetAddress: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false
  },
  emailToken: {
    type: String,
    required: false
  },
  otp: {
    type: String,
    required: false
  },
  adhar: {
    type: String,
    required: false
  },
  biodata: {
    type: String,
    required: false
  },
  certificate: {
    type: String,
    required: false
  },
  license: {
    type: String,
    required: false
  },
  passbook: {
    type: String,
    required: false
  },
  pancard: {
    type: String,
    required: false
  },
  photo: {
    type: String,
    required: false
  },
  phoneNumber: {
    type: String,
    required: false
  },
  alternatePhoneNumber: {
    type: String,
    required: false
  },
  adharNumber: {
    type: String,
    required: false
  },
  assignedTasks: {
    type: Array,
    required: false
  },
  userType: {
    type: String,
    required: false
  },
  approvedByAdmin:{
    type: Boolean,
    required: false, 
    default: false
  },

});

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(32).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function (password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJwt = function () {
  var expiry = new Date();
  expiry.setDate(expiry.getDate());

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.firstName + " " +this.lastName,
    userType: this.userType ? this.userType : "technician" ,
    exp: parseInt(expiry.getTime()),
  }, "ALVIN"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};
// plugin for passport-local-mongoose
userSchema.plugin(passportLocalMongoose);

mongoose.model('User', userSchema);
