const {Router} = require('express')
const controller = require('./controller')
const routes = Router();

routes.get('/licence',controller.checkLicence);
routes.post('/licence',controller.register);

module.exports = routes;