import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, CheckCheck, Flag, MessageCircle, Loader2 } from 'lucide-react';
import { Message } from '../types';
import { formatTimestamp } from '../utils/helpers';
import { useChat } from '../context/ChatContext';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const { addSystemMessage } = useChat();
  const [isReporting, setIsReporting] = useState(false);
  
  const handleReportIssue = async () => {
    setIsReporting(true);
    try {
      addSystemMessage("Thank you for reporting the issue. Our team will review it shortly.");
    } finally {
      setIsReporting(false);
    }
  };

  const handleContinueChat = () => {
    addSystemMessage("Let's continue our conversation.");
  };
  
  const renderMessageStatus = () => {
    if (message.sender === 'bot' || message.sender === 'system') return null;
    
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
        return (
          <div className="space-y-3">
            <div className="relative group">
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
            {message.sender === 'bot' && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleReportIssue}
                  disabled={isReporting}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isReporting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Flag size={14} />
                  )}
                  Report Issue
                </button>
                <button
                  onClick={handleContinueChat}
                  className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm hover:bg-blue-200 transition-colors flex items-center gap-1"
                >
                  <MessageCircle size={14} />
                  Continue Chat
                </button>
              </div>
            )}
          </div>
        );
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

export default MessageItem