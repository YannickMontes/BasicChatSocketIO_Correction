const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const User = require("./users");

const { Server } = require("socket.io");
const { off } = require("process");
const io = new Server(server);

let users = [];

app.get('/', (req, res) => {
	res.sendFile(__dirname + "/client/index.html");
});

io.on('connection', (socket) => {
	console.log("Someone's connected!");

	socket.on('username', (name) => {
		let user = new User(socket, name);
		users.push(user);
		io.emit("new connection", name);
	});

	socket.on('disconnect', () => {
		let user = users.find(user => user.socket == socket);
		if(user)
		{
			users.splice(users.indexOf(user), 1);
		}
	});

	socket.on('chat message', (msg) => {
		let user = users.find(user => user.socket === socket);
		if(user)
		{
			io.emit('chat message', {username: user.name, msg: msg});
		}
	});

	socket.on("is typing", (isTyping) => {
		console.log("is typing received");
		let user = users.find(user => user.socket === socket);
		if(user)
		{
			socket.broadcast.emit('is typing', {name: user.name, isTyping: isTyping });
		}
	});
});

server.listen(3000, () => {
	console.log("Now listening on port 3000");
});