const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

},
    {
        timestamps: true // This will automatically add createdAt and updatedAt fields
    });

module.exports = mongoose.model("user", userSchema);