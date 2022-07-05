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
var ctrlGetCustomers = require('../controllers/get-customers');
var ctrlAuth = require('../controllers/authentication');
var ctrlOtp = require('../controllers/verify-otp');
var ctrlEmailVerify = require('../controllers/emailverify');
var ctrlPurchaseHistory = require('../controllers/purchase-history');

// profile
router.get('/profile', auth, ctrlProfile.profileRead);
router.get('/jobDetails', auth, ctrlJobDetails.jobDetails);
router.get('/techniciansList', auth, ctrlTechniciansList.techniciansList);
router.post('/createCustomer', auth, ctrlCreateCustomer.createCustomer);
router.get('/get-customers', auth, ctrlGetCustomers.getCustomers);
router.post('/purchase', auth, ctrlPurchase.purchase);
router.post('/verifyEmail', ctrlEmailVerify.verifyEmail);
router.post('/purchaseHistory', auth, ctrlPurchaseHistory.purchaseHistory);
router.post('/verifyOtp', ctrlOtp.verifyOtp);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;
