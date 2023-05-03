const express = require('express');

const {loginUser, joinLeague, createLeague } = require('../controllers/userController');

const router = express.Router();

//login
router.post('/login', loginUser); 
//signup
router.post('/join-league', joinLeague); 
//create a league
router.post('/create-league', createLeague);

//DELETE methods
//TODO:
//  deleteUser
//  resetPassword

module.exports = router;