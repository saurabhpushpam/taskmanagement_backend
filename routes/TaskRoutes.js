const express = require("express");
const task_routes = express();

const auth = require("../middleware/auth");
const task_controller = require("../controllers/TaskController");

const bodyParser = require("body-parser");
task_routes.use(bodyParser.json());
task_routes.use(bodyParser.urlencoded({ extended: true }));


task_routes.post('/addtask', auth, task_controller.addtask);
task_routes.get('/getalltask', auth, task_controller.getallusertask);
task_routes.get('/getpendingtask', auth, task_controller.getpendingtask);
task_routes.get('/getcompletetask', auth, task_controller.getcompletetask);
task_routes.get('/gettaskbyid/:id', task_controller.gettaskbytaskid);
task_routes.post('/deletetask/:id', task_controller.deletetask);
task_routes.post('/updatetask/:id', task_controller.updatetask);


module.exports = task_routes;