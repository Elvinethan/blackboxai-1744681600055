import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { login, verifyToken } from './auth/auth.controller';
import { getConversations, syncConversations, getMessages } from './controllers/conversation.controller';

dotenv.config();

export const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/messaging-tracker')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.post('/api/auth/login', login);
app.get('/api/auth/verify', verifyToken, (req, res) => {
  res.json({ message: 'Token is valid' });
});

// Conversation routes
app.get('/api/conversations', verifyToken, getConversations);
app.post('/api/conversations/sync', verifyToken, syncConversations);
app.get('/api/conversations/:platform/:partnerId/messages', verifyToken, getMessages);

// Basic route
app.get('/', (req, res) => {
  res.send('Messaging Tracker API');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
