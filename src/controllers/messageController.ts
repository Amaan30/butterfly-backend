// controllers/messageController.ts
import { Request, Response } from 'express';
import { Message } from '../model/message';

export const getMessages = async (req: Request, res: Response) => {
  const { userId1, userId2 } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 },
      ],
    }).sort({ createdAt: 1 }); // chronological
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch messages', err });
  }
};
