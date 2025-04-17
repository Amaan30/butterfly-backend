import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import path from 'node:path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import { Server } from 'socket.io';
import http from 'http';
import messageRoutes from './routes/messageRoutes';
import { Message } from './model/message';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: [
    'http://localhost:5173',                        // Development
    'https://gleaming-strudel-07579f.netlify.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

// In src/server.ts
const uploadsPath = path.resolve(process.cwd(), 'uploads');
console.log(`Serving uploads from: ${uploadsPath}`);
app.use('/uploads', express.static(uploadsPath));

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not defined in environment variables");
  process.exit(1); // Exit if missing critical config
}

const MONGO_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

//chat function from here

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',                        // Development
      'https://gleaming-strudel-07579f.netlify.app'
    ],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("send-message", async (message) => {
    const { sender, receiver, content } = message;
    const newMessage = await new Message({ sender, receiver, content }).save();
    io.to(receiver).emit("receive-message", newMessage); // Emit to the receiver
    socket.broadcast.emit('receive-message', message); // you can limit to a room
  });

  socket.on("join-room", (userId) => {
    socket.join(userId); // Users join a room with their ID
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);


app.get('/', (_req: Request, res: Response) => {
  res.send('Welcome to the server!');
});


app.get('/api/data', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the backend!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
