const express = require('express');
const routes = express.Router();
const Adminctr = require('../../../../controller/api/v1/adminController/adminCtr')
const passport = require('passport')

routes.get('/', passport.authenticate('jwt', { failureRedirect: '/unauthor' }),Adminctr.home);
routes.post('/signin', passport.authenticate('jwt', { failureRedirect: '/unauthor' }),Adminctr.signin)
routes.post('/inserData', passport.authenticate('jwt', { failureRedirect: '/unauthor' }),Adminctr.singleSignUp);
routes.get('/statusData',Adminctr.singledata)
routes.post('/adminprofile',Adminctr.adminprofile)
routes.put('/update/:id',Adminctr.update)

module.exports = routes;