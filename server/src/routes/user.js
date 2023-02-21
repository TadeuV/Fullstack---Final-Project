const express = require('express');
const router = express.Router();

const {loginUser,signUpUser}=require('../controllers/userController')

router.post('/login',loginUser)
// router.get('/login',loginUser)


router.post('/signup',signUpUser)
// router.get('/signup',signUpUser)


module.exports=router