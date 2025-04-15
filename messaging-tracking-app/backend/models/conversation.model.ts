import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  content: string;
  sender: string;
  timestamp: Date;
  platform: string;
}

export interface IConversation extends Document {
  partnerId: string;
  platform: string;
  messages: IMessage[];
  lastUpdated: Date;
}

const MessageSchema: Schema = new Schema({
  content: { type: String, required: true },
  sender: { type: String, required: true },
  timestamp: { type: Date, required: true },
  platform: { type: String, required: true }
});

const ConversationSchema: Schema = new Schema({
  partnerId: { type: String, required: true },
  platform: { type: String, required: true },
  messages: [MessageSchema],
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model<IConversation>('Conversation', ConversationSchema);
