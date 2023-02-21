const User = require('../models/userModal')
const jwt = require('jsonwebtoken')
require(`dotenv`).config();

 const createToken = (_id) =>{
    return jwt.sign({_id},process.env.SECRET_KEY,{expiresIn:'1d'})
}
    // forgot to return the token


const loginUser = async (req,res) =>{
    const {email,password} = req.body;

    try{
        const user = await User.login(email,password);

        const token = createToken(user._id)

        const stringId = (user._id)

        res.status(200).json({email,token,stringId})
    }catch (error){
        res.status(400).json({error: error.message})
    }
}

const signUpUser = async (req,res) =>{
    const {email,username,password} = req.body

    try{
        const user = await User.signup(email,username,password);

        const token = createToken(user._id)

        const stringId = (user._id)

        res.status(200).json({email,token,stringId})
    }catch (error){
        res.status(400).json({error: error.message})
    }
}

module.exports={loginUser,signUpUser}