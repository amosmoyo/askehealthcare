const express = require('express');

const user = require('../controllers/user')

const { protect } = require('../middlewares/auth')

const router = express.Router();

router.post('/profile', protect, user.createprofile);

router.get('/profile',  user.getUsers)

router.get('/profile/account', protect, user.getUser)

router.get('/profile/:user_id', user.getProfile)

router.delete('/profile/account', protect, user.deleteAccount)

router.put('/profile/experience', protect, user.addExpirience);

router.delete('/profile/experience/:exp_id', protect, user.deleteExperience);

module.exports = router;