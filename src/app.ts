import express from "express";
import http from "http";
import { Server as SocketIO } from "socket.io";
import User from "./users";
import path from "path";

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server);

const users: User[] = [];

app.get("/", (req, res) => {
	res.sendFile(path.resolve("./client/index.html"));
});

io.on("connection", (socket) => {
	console.log("Someone's connected!");

	socket.on("username", (name: string) => {
		const user = new User(socket, name);
		users.push(user);
		io.emit("new connection", name);
	});

	socket.on("disconnect", () => {
		const user = users.find((user) => user.socket === socket);
		if (user) {
			users.splice(users.indexOf(user), 1);
		}
	});

	socket.on("chat message", (msg: string) => {
		const user = users.find((user) => user.socket === socket);
		if (user) {
			io.emit("chat message", { username: user.name, msg: msg });
		}
	});

	socket.on("is typing", (isTyping: boolean) => {
		console.log("is typing received");
		const user = users.find((user) => user.socket === socket);
		if (user) {
			socket.broadcast.emit("is typing", {
				name: user.name,
				isTyping: isTyping,
			});
		}
	});
});

server.listen(3000, () => {
	console.log("Now listening on port 3000");
});
