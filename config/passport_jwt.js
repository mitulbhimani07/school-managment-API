const passport = require('passport');

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
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
passport.serializeUser ((user , done) =>{
    console.log(user.id,"ygy8hu");
    
    return done(null,user.id)   
    
})

passport.deserializeUser(async(id , done)=>{
    let userData = await signIn.findById(id)
      if (userData) {
        return done(null,userData)
      } else {
        return done(null,false)
      }

    
})


module.exports = passport;