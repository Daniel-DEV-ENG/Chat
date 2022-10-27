const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require("path");
const authRoutes = require("./Routes/Auth")
const app = express();
const messageRoutes = require("./Routes/Message")
require("dotenv").config();
app.use(cors())
app.use(express.json())
const socket = require("socket.io")
app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, "index.html"));
})

//method have listen on my event 
//socket emit ------send for just socket client
//io emit -------emit for all in server
//socket broadcast emit ----emit for all client expected client


///////////////////////////////////////API///////////////////
app.use('/api/auth', authRoutes)
app.use("/api/messages", messageRoutes);


//////////////////////connect to D A T A B A S E  ///////////////////////
mongoose.connect(process.env.MONGO_URL)
    .then(() => { console.log("connect to database ....") })
    .catch((error) => { console.log(error.message) })
////////////server //////////////////////////////
const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);
//////////////////////////////////////////////SOCKET IO//////////////////
const io = socket(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });
  
  global.onlineUsers = new Map();
  io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });
  
    socket.on("send-msg", (data) => {
      console.log(data);
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data.msg);
      }
    });
  });
  