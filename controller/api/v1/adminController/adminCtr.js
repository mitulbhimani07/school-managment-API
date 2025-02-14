
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
                let token = await jwt.sign({userData : getuser},'ADMIN')
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
module.exports.singledata = async (req,res)=>{
    try{
        let singledata = await signin.findById(req.query.id);
        console.log(singledata,req.query);
        
        if (singledata) {
            return  res.status(200).json({msg:"Data find successfuly",data:singledata});

        }
        else{
            return  res.status(200).json({msg:"Data not found!"});

        }
    }
    catch(err){
        return  res.status(400).json({msg:"somthing woas wrong !",err:err});

    }
}
module.exports.logout = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Get token from headers
        if (!token) {
            return res.status(401).json({ msg: "No token provided" });
        }

        await signin.create({ token }); // Store token in the blacklist

        return res.status(200).json({ msg: "Logout successful" });
    } catch (err) {
        return res.status(500).json({ msg: "Something went wrong!", err: err });
    }
};
module.exports.adminprofile = async (req,res) =>{
    try{
        console.log(req.body);
        let ProfileAdmin = await signin.create(req.body)
        if (ProfileAdmin) {

            return  res.status(200).json({msg:"Profile added successfuly"});
                
        } else {
                
            return  res.status(200).json({msg:"Plaees tray again"});
            
        }
    }catch(err){
        return  res.status(400).json({msg:"somthing woas wrong !",err:err});

    }
}
module.exports.update = async (req,res) =>{
    console.log(req.params.id);
    
    try{
        let FindUpdateId = await signin.findById(req.params.id)
        if (FindUpdateId) {
            let UpdateData = await signin.findByIdAndUpdate(FindUpdateId._id , req.body)
            if (UpdateData) {
                return  res.status(200).json({msg:"Update successfuly"});

            }
            else{

                return  res.status(400).json({msg:" !",err:err});
            }
        }
        else{
            return  res.status(400).json({msg:"somthing woas wrong !",err:err});

        }
    }catch(err){
        return  res.status(400).json({msg:"somthing woas wrong !",err:err});

    }
}