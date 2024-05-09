const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const Todo = require("./controllers/models/todo");
require("dotenv").config(); // Load environment variables from .env file

console.log(process.env.mongodbsrc);

mongoose
  .connect(process.env.mongodbsrc, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("addTodo", async (data) => {
    const todo = new Todo({
      title: data.title,
    });
    const newTodo = await todo.save();
    io.emit("todoAdded", newTodo);
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", {
      username: "User", // You can replace this with the actual username
      title: data.title,
    });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
