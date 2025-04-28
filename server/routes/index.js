const express = require('express');
const registerUser = require('../controller/registerUser');
const checkEmail = require('../controller/checkEmail');
const checkPassword = require('../controller/checkPassword');
const userDetails = require('../controller/userDetails');
const logOut = require('../controller/logout');
const updateUserDetails = require('../controller/updateUserDetails');
const searchUser = require('../controller/searchUser');


const anonSessionRoutes = require('./anonSession');
const router = express.Router();

// Anonymous session routes
router.use(anonSessionRoutes);

// Create user API
router.post('/register', registerUser);
//check user email
router.post('/email', checkEmail);
//check password
router.post('/password', checkPassword);
//login user detais
router.get('/user-details', userDetails);
//logout user
router.get('/logout', logOut);
//update user details
router.post('/update-user', updateUserDetails);
//search user
router.post('/search-user', searchUser);

module.exports = router;
