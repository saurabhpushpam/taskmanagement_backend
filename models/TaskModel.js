const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  taskname: {
    type: String,
    // required: true
  },

  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },

  description: {
    type: String,
    // required: true
  },

  priority: {
    type: String,
  },

  status: {
    type: String,


  },

  duedate: {
    type: Date

  },

  category: {
    type: String,

  }

},
  {
    timestamps: true
  });

module.exports = mongoose.model("task", userSchema);