const express = require('express');
const routes = express.Router();
const Adminctr = require('../../../../controller/api/v1/adminController/adminCtr')

routes.get('/',Adminctr.home);
routes.get('/signin',Adminctr.signin)
routes.post('/inserData',Adminctr.singleSignUp);

module.exports = routes;