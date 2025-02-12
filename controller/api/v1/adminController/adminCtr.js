
const signin = require('../../../../model/adminModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
module.exports.home = async (req,res)=>{
    try{
        let getuser = await signin.find()
        return  res.status(200).json({msg:"User Page",data:getuser});
    }
    catch(err){
        console.log(err);
        return  res.status(200).json({msg:"somthing woas wrong !"});
    }
}
module.exports.singleSignUp = async (req,res)=>{
    console.log(req.body);
    
    try{
        let chekuser = await signin.find({email:req.body.email}).countDocuments()
        if (chekuser==0) {
           if (req.body.password == req.body.confomPassword) {
                req.body.password =  await bcrypt.hash(req.body.password,10)
                console.log(req.body.password);
                let signUp = await signin.create(req.body)
                if (signUp) {

                    return  res.status(200).json({msg:"sign up DATA added successfuly"});
                        
                } else {
                        
                    return  res.status(200).json({msg:"Plaees tray again"});
                    
                }
           }
           else{

               return  res.status(200).json({msg:"password and confomPassword not match"});
           }
        }else{
            return  res.status(200).json({msg:"email is alredy axsit"});

        }

    }
    catch(err){
        return  res.status(400).json({msg:"somthing woas wrong !",err:err});

    }
}
module.exports.signin = async (req,res)=>{
    try{
        let getuser = await signin.findOne({email:req.body.email})
        if (getuser) {
            let chekPassword = await bcrypt.compare(req.body.password,getuser.password);
            if (chekPassword) {
                let token = await jwt.sign({userData : getuser},'user')
                return  res.status(400).json({msg:"signin successfuly",data:token});

            } else {
                return  res.status(400).json({msg:"invalid password !",err:err});

            }
        }
        else{

            return  res.status(200).json({msg:"email not found"});
        }

    }
    catch(err){
        return  res.status(400).json({msg:"somthing woas wrong !",err:err});

    }
}