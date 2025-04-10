import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import path from 'node:path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import fs from 'fs';

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

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.send('Welcome to the server!');
});


app.get('/api/data', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the backend!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
