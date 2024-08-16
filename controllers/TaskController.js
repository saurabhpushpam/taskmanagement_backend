const task = require('../models/TaskModel');
const user = require("../models/userModel");

const bcryptjs = require('bcryptjs');

const config = require("../config/config");




const addtask = async (req, res) => {
  console.log(req.user);

  try {

    const newtask = new task({
      taskname: req.body.taskname,
      userid: req.user._id,
      description: req.body.description,
      priority: req.body.priority,
      status: 'pending',
      duedate: req.body.duedate,
      category: req.body.category


    });


    const taskdata = await newtask.save();
    res.status(200).send({ success: true, data: taskdata });


  }

  catch (error) {

    res.status(400).send(error.message);
  }
}



// const getallusertask = async (req, res) => {
//   try {

//     console.log('object', req.user);

//     const userid = req.user._id;
//     console.log(userid);
//     const validuser = await user.findById(userid);
//     if (!validuser) {
//       res.status(200).send({ success: true, msg: "invalid user id" });

//     }

//     else {
//       const usertask = await task.find({ userid: userid });
//       if (usertask) {
//         res.status(200).send({ success: true, data: usertask });

//       }
//     }
//   } catch (error) {
//     res.status(400).send({ success: true, msg: error.message });

//   }
// }


const getallusertask = async (req, res) => {
  try {
    // console.log('object', req.user);

    const userid = req.user._id;
    console.log(userid);

    const validuser = await user.findById(userid);
    if (!validuser) {
      return res.status(200).send({ success: false, msg: "Invalid user ID" });
    }

    const usertask = await task.find({ userid: userid });
    if (usertask) {
      return res.status(200).send({ success: true, data: usertask });
    }

    return res.status(404).send({ success: false, msg: "No tasks found" });

  } catch (error) {
    return res.status(400).send({ success: false, msg: error.message });
  }
}




const getcompletetask = async (req, res) => {
  try {

    const userid = req.user._id;
    // console.log(userid);

    const validuser = await user.findById(userid);
    if (!validuser) {
      return res.status(200).send({ success: false, msg: "Invalid user ID" });
    }

    const usertask = await task.find({ userid: userid, status: 'Complete' });
    if (usertask) {
      return res.status(200).send({ success: true, data: usertask });
    }

    return res.status(404).send({ success: false, msg: "No tasks found" });

  } catch (error) {
    return res.status(400).send({ success: false, msg: error.message });
  }
}







const getpendingtask = async (req, res) => {
  try {

    const userid = req.user._id;
    console.log(userid);

    const validuser = await user.findById(userid);
    if (!validuser) {
      return res.status(200).send({ success: false, msg: "Invalid user ID" });
    }

    const usertask = await task.find({ userid: userid, status: 'pending' });
    if (usertask) {
      return res.status(200).send({ success: true, data: usertask });
    }

    return res.status(404).send({ success: false, msg: "No tasks found" });

  } catch (error) {
    return res.status(400).send({ success: false, msg: error.message });
  }
}




const gettaskbytaskid = async (req, res) => {
  try {
    const taskid = req.params.id;
    const validtask = await task.findById(taskid);
    if (validtask) {
      res.status(200).send({ success: true, data: validtask });

    }

    else {
      res.status(200).send({ success: true, msg: "invalid task id" });

    }
  } catch (error) {
    res.status(400).send({ success: true, msg: error.message });

  }

}





const deletetask = async (req, res) => {
  try {
    const taskid = req.params.id;
    const gettask = await task.findById(taskid);
    if (gettask) {
      const deletedata = await task.deleteOne({ _id: taskid });
      res.status(200).send({ success: true, msg: "Task deleted successfully" });

    }
    else {
      res.status(200).send({ success: true, msg: "invalid task id" });

    }
  } catch (error) {
    res.status(400).send({ success: true, msg: error.message });

  }
}




const updatetask = async (req, res) => {
  try {
    const taskid = req.params.id;
    const validtask = await task.findById(taskid);
    if (validtask) {
      const { taskname, description, priority, status, duedate, category } = req.body;
      const taskdata = await task.updateOne(
        { _id: taskid },
        { $set: { taskkname: taskname, description: description, priority: priority, status: status, duedate: duedate, category: category } }
      );

      res.status(200).send({ success: true, data: taskdata });


    } else {
      res.status(200).send({ success: true, msg: "invalid task id" });

    }
  } catch (error) {
    res.status(400).send({ success: true, msg: error.message });

  }
}


module.exports = {
  addtask,
  getallusertask,
  gettaskbytaskid,
  getcompletetask,
  getpendingtask,
  deletetask,
  updatetask

}