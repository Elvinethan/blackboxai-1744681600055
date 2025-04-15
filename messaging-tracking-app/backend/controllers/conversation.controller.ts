import { Request, Response } from 'express';
import Conversation from '../models/conversation.model';
import { WhatsAppService } from '../integrations/whatsapp.service';
import { TelegramService } from '../integrations/telegram.service';
import { SMSService } from '../integrations/sms.service';
import { verifyToken } from '../auth/auth.controller';

export const getConversations = async (req: Request, res: Response) => {
  try {
    const conversations = await Conversation.find();
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversations' });
  }
};

export const syncConversations = async (req: Request, res: Response) => {
  try {
    const { platform, identifier } = req.body;
    
    switch (platform) {
      case 'whatsapp':
        await WhatsAppService.getInstance().fetchConversations(identifier);
        break;
      case 'telegram':
        await TelegramService.getInstance().fetchConversations(identifier);
        break;
      case 'sms':
        await SMSService.getInstance().fetchConversations(identifier);
        break;
      default:
        return res.status(400).json({ message: 'Invalid platform' });
    }

    res.json({ message: 'Conversations synced successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error syncing conversations' });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { platform, partnerId } = req.params;
    const conversation = await Conversation.findOne({ platform, partnerId });
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.json(conversation.messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
};
