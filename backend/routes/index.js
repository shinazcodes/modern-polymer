var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload',
  algorithms: ['HS256'],
});

var ctrlProfile = require('../controllers/profile');
var ctrlPurchase = require('../controllers/purchase');
var ctrlJobDetails = require('../controllers/job-details');
var ctrlTechniciansList = require('../controllers/technician-list');
var ctrlCreateCustomer = require('../controllers/create-customer');
var ctrlAssignJob = require('../controllers/assign-job');
var ctrlGetCustomers = require('../controllers/get-customers');
var ctrlAuth = require('../controllers/authentication');
var ctrlOtp = require('../controllers/verify-otp');
var ctrlOtpVerification= require('../controllers/verify-user');
var ctrlEmailVerify = require('../controllers/emailverify');
var ctrlPurchaseHistory = require('../controllers/purchase-history');
var ctrlgenerateInvoice = require('../controllers/generateInvoice');

// profile
router.get('/profile', auth, ctrlProfile.profileRead);
router.get('/jobDetails', auth, ctrlJobDetails.jobDetails);
router.get('/techniciansList', auth, ctrlTechniciansList.techniciansList);
router.post('/createCustomer', auth, ctrlCreateCustomer.createCustomer);
router.get('/get-customers', auth, ctrlGetCustomers.getCustomers);
router.post('/purchase', auth, ctrlPurchase.purchase);
router.post('/assign-job', auth, ctrlAssignJob.assignJob);
router.post('/verifyEmail', ctrlEmailVerify.verifyEmail);
router.post('/purchaseHistory', auth, ctrlPurchaseHistory.purchaseHistory);
router.post('/generateInvoice', auth, ctrlgenerateInvoice.generateInvoice);
router.post('/getInvoice', auth, ctrlgenerateInvoice.getInvoice);
router.post('/verifyOtp', ctrlOtp.verifyOtp);
router.post('/otpVerification', ctrlOtpVerification.otpVerification);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;
