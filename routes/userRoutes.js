const express = require("express");
const user_routes = express();

const auth = require("../middleware/auth");
const user_controller = require("../controllers/userController");

const bodyParser = require("body-parser");
user_routes.use(bodyParser.json());
user_routes.use(bodyParser.urlencoded({ extended: true }));


user_routes.post('/register', user_controller.register_user);
user_routes.get('/getalluserdata', user_controller.getalluserdata);
user_routes.get('/getuserdatabyid/:id', user_controller.getuserbyid);
user_routes.get('/getuserdatabytoken', auth, user_controller.getuserbytoken);

user_routes.post('/login', user_controller.user_login);


module.exports = user_routes;