const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const http = require('http');

app.use(express.json());

const mongoose = require('mongoose');

// const DB = "mongodb+srv://spuspam111:Sp123456@cluster0.0taaaup.mongodb.net/furniro?retryWrites=true&w=majority";
// mongoose.connect(DB)
//     .then(() => {
//         console.log("Connected to MongoDB");
//         const server = http.createServer(app);
//         server.listen(PORT, () => {
//             console.log(`Server is running on :${PORT}`);
//         });
//     })
//     .catch(error => {
//         console.error("Error connecting to MongoDB:", error);
//     });


const conn = mongoose.connect("mongodb://127.0.0.1:27017/taskmanagement").then(() => {
    console.log('MongoDB Connected');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});


// user routes

const user_route = require("./routes/userRoutes");
app.use('/api', user_route);

// task routes

const task_route = require("./routes/TaskRoutes");
app.use('/api', task_route);


const PORT = 5000;


app.listen(PORT, function () {
    console.log('server is running on port : ', PORT);
});

