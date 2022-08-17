var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
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
  hash: String,
  salt: String
});

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function (password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJwt = function () {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.firstName + " " +this.lastName,
    userType: this.userType ? this.userType : "technician" ,
    exp: parseInt(expiry.getTime() / 1000),
  }, "ALVIN"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

mongoose.model('User', userSchema);
