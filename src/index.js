import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoute from './route/userRoutes/userRoute.js';
import roomRoutes from './route/room/room.js';
import socketHandler from "./socket.js";

import http from 'http';
import {Server} from 'socket.io';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//
const server= http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());


app.use(cors());
app.use(express.json());

app.use('/user/v1',userRoute);
app.use('/room/v2',roomRoutes);

app.get("/", (req, res) => {
  res.send("Loomie backend is running!");
});

socketHandler(io);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
