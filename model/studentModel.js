const mongoose=require('mongoose');

const StudentSchema=mongoose.Schema({
    StudentName:{
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

const Student = mongoose.model('Student',StudentSchema);
module.exports=Student;