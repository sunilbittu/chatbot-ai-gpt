import React from 'react';
import { motion } from 'framer-motion';
import { Check, CheckCheck } from 'lucide-react';
import { Message } from '../types';
import { formatTimestamp } from '../utils/helpers';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  const renderMessageStatus = () => {
    if (message.sender === 'bot') return null;
    
    switch (message.status) {
      case 'sending':
        return <span className="w-3 h-3 bg-gray-300 rounded-full animate-pulse" />;
      case 'sent':
        return <Check size={14} className="text-gray-400" />;
      case 'delivered':
        return <CheckCheck size={14} className="text-gray-400" />;
      case 'read':
        return <CheckCheck size={14} className="text-blue-400" />;
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (message.type) {
      case 'text':
        return <p className="whitespace-pre-wrap">{message.content}</p>;
      case 'image':
        return (
          <div className="relative group">
            <img 
              src={message.content} 
              alt="User uploaded"
              className="rounded-lg max-w-xs max-h-60 object-contain cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => window.open(message.content, '_blank')}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-lg" />
          </div>
        );
      default:
        return <p className="whitespace-pre-wrap">{message.content}</p>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-4`}
    >
      <div
        className={`max-w-xs md:max-w-md rounded-2xl p-3 shadow-sm ${
          isUser 
            ? 'bg-gradient-to-r from-blue-400 to-green-400 text-white'
            : 'bg-white border border-gray-100'
        }`}
      >
        {renderContent()}
      </div>
      <div className="flex items-center mt-1 text-xs text-gray-500 space-x-1">
        <span>{formatTimestamp(message.timestamp)}</span>
        {renderMessageStatus()}
      </div>
    </motion.div>
  );
};

export default MessageItem;