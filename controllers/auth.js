const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError,UnauthenticatedError } = require('../errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req,res) =>{
    // const {name,email,password} = req.body;
    // if(!name || !email || !password){
    //     throw new BadRequestError('please provide name,email and password');
    // }

    //hashing the user password using bcryptjs
    const {name,email,password} = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    const tempUser = {name,email,password:hashedPassword};
    const user = await User.create({...tempUser});

    const token = jwt.sign({userId:user._id,name:user.name},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_LIFETIME,
    });
    res.status(StatusCodes.CREATED).send({user : {name:user.name},token});
}
const login = async (req,res) =>{
    const {email,password} = req.body;

    // if(!email || !password){
    //     throw new BadRequestError('please provide email and password');
    // }

    //checking if user exists or not
    const user = await User.findOne({email});
    //if user does not exists
    if(!user){
        throw UnauthenticatedError('Invalid Credentials')
    }
    //checking if password is correct
    const isPasswordCorrect = await bcrypt.compare(password,user.password);
    if(!isPasswordCorrect){
        throw UnauthenticatedError('Invalid Credentials')
    }

    const token = jwt.sign({userId:user._id,name:user.name},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_LIFETIME,
    });
    res.status(StatusCodes.OK).json({user:{name:user.name},token});
}

module.exports = {login,register};