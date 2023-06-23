const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please provide name'],
        minlength:3,
        maxlength:50,
    },
    email:{
        type:String,
        required:[true,'please provide email'],
        min:3,
        maxlength: 50,
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'please provide valid email'
        ],
        unique:true,
    },
    password:{
        type:String,
        required:[true,'please provide password'],
        minlength:6,
    }
})

// runs before save (pre save)
// UserSchema.pre('save',async function (){
//     const salt = await bcrypt.genSalt(10);
//     //here this points to our document
//     this.password = await bcrypt.hash(this.password,salt);
// })

// schema instane method -> invoke it to generate jwt token and
// UserSchema.methods.createJWT = function () {
//     return jwt.sign({userId:this._id,name:this.name},{
//         expiresIn: '30d'
//     })
// }

// //using instance methods to compare hashed password for login functionality
// UserSchema.methods.comparePassword = async function(candidatePassword) {
//     const isMatch = await bcrypt.compare(candidatePassword,this.password);
//     return isMatch;
// }

module.exports = mongoose.model('User',UserSchema);