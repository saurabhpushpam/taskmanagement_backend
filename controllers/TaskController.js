const task = require('../models/TaskModel');
const user = require("../models/userModel");
const nodemailer = require('nodemailer');
const cron = require('node-cron');

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
    // console.log(userid);

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







// const sendremindermail = async (username, email, token) => {

const sendremindermail = async (username, email, taskName) => {

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: config.emailUser,
        pass: config.emailPassword
      }
    });

    const mailOption = {
      from: config.emailUser,
      to: email,
      subject: 'Task Reminder',
      html: `<p>Hi <b>${username}</b>, <br/> this is a reminder for your task: <strong>${taskName}</strong>. <br/> The due date is today. Please make sure to complete it on time.</p>`

      // html: '<p> Hii ' + username + ', please copy the link <a href= "http://localhost:3000/api/reset-password?token=' + token + '"> and reset your password </a>'
    }

    transporter.sendMail(mailOption, function (error, info) {
      if (error) {
        console.log(error);

      }
      else {
        console.log("Mail has been sent : ", info.response);
      }
    });



  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
}



const reminder = async () => {
  try {
    // Get the current date and time
    const now = new Date();

    // Set the time to 00:00:00 for comparison
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const todayEnd = new Date(todayStart);
    todayEnd.setHours(23, 59, 59, 999);

    // Find all tasks due today and still pending
    const dueTasks = await task.find({
      status: 'pending',
      duedate: {
        $gte: todayStart,
        $lt: todayEnd,
      },
    });

    for (const dueTask of dueTasks) {
      const userData = await user.findById(dueTask.userid);

      if (userData) {
        await sendremindermail(userData.name, userData.email, dueTask.taskname);
      }
    }
  } catch (error) {
    console.log('Error while checking for due tasks:', error.message);
  }
};


// Schedule the cron job to run every day at 12:00 AM
cron.schedule('0 0 * * *', () => {
  console.log('Running midnight at 12:00 AM task reminder cron job');
  reminder();
});

// // Schedule the cron job to run every day at 11:30 PM
// cron.schedule('43 23 * * *', () => {
//   console.log('Running 11:30 PM task reminder cron job');
//   reminder();
// });







module.exports = {
  addtask,
  getallusertask,
  gettaskbytaskid,
  getcompletetask,
  getpendingtask,
  deletetask,
  updatetask,
  reminder

}