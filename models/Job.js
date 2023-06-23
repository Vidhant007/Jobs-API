const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
    company:{
        type:String,
        require:[true,'please provide company name'],
        maxlength:50
    },
    position:{
        type:String,
        require:[true,'please provide position'],
        maxlength:100
    },
    status:{
        type:String,
        //for choosing between a set of options
        enum:['interview','declined','pending'],
        default:'pending',
    },
    createdBy:{
        // assigning job with the user
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true,'please provide user']
    }
},{timestamps:true})

module.exports = mongoose.model('Job',jobSchema);