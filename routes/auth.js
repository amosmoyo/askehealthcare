const express = require('express');

const auth = require('../controllers/auth');

const { protect } = require('../middlewares/auth')

const router = express.Router();

router.post('/register', auth.register);

router.post('/login', auth.login);

router.post('/forgotpassword', auth.forgotPassword);

router.put('/resetpassword/:resettoken', auth.resetPassword);

router.put('/updatedetails', protect, auth.updateDetails);

router.put('/updatepassword', protect, auth.updatePassword);

router.get('/account', protect, auth.account);

module.exports = router;