const passport = require('passport');

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
// Admin passport
const opts = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'ADMIN'
}
const signIn = require('../model/adminModel')

passport.use(new JwtStrategy(opts,async function(payload, done) {
    // console.log(payload);
    let singleUser =await  signIn.findOne({email: payload.userData.email})
    console.log(singleUser,"uyfytftftyyyf");
    
    
        if (singleUser) {
            return done(null, singleUser);
        } else {
            return done(null, false);
        }
    
}));

//faculty passport
const FacultyModel=require('../model/facultyModel');
var facultyOpts={
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:"Faculty"
}

passport.use('faculty',new JwtStrategy(facultyOpts, async function(payload,done){
    let checkFacultyData=await FacultyModel.findOne({email:payload.FacultyData.email});
    if(checkFacultyData){
        return done(null,checkFacultyData);
    }else{
        return done(null,false)
    }
}))

//passport serialize and deserialize
passport.serializeUser ((user , done) =>{
    console.log(user.id,"ygy8hu");
    
    return done(null,user.id)   
    
})
//passport deserialize
passport.deserializeUser(async(id , done)=>{
    let userData = await signIn.findById(id)
      if (userData) {
        return done(null,userData)
      } else {
        return done(null,false)
      }

    
})


module.exports = passport;