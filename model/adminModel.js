const mongoose = require('mongoose');
const { type } = require('os');
const SignScheema = mongoose.Schema({
    name : {
        type : String,
        require : true
    },
    email : {
        type : String,
        require : true
    },
    password : {
        type : String,
        require : true
    },
    status : {
        type : Boolean,
        default : true
    }
})

const Sign = mongoose.model('Sign',SignScheema);
module.exports = Sign