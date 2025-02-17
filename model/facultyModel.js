const mongoose=require('mongoose');

const FacultySchema=mongoose.Schema({
    userName:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    status:{
        type:Boolean,
        default:true
    }
},
    {timestamps:true}
)

const Faculty = mongoose.model('Faculty',FacultySchema);
module.exports=Faculty;