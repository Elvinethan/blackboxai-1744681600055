import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Message {
  content: string;
  sender: string;
  timestamp: string;
  platform: string;
}

interface Conversation {
  _id: string;
  partnerId: string;
  platform: string;
  messages: Message[];
  lastUpdated: string;
}

const ConversationList: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/conversations');
        setConversations(response.data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  if (loading) return <div>Loading conversations...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Conversations</h2>
      <div className="space-y-4">
        {conversations.map((conversation) => (
          <div key={conversation._id} className="border p-4 rounded-lg">
            <div className="flex justify-between">
              <span className="font-medium">{conversation.partnerId}</span>
              <span className="text-sm text-gray-500">{conversation.platform}</span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Last message: {conversation.messages[conversation.messages.length - 1]?.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
