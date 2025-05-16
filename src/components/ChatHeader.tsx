import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Trash2 } from 'lucide-react';
import { useChat } from '../context/ChatContext';

const ChatHeader: React.FC = () => {
  const { clearMessages } = useChat();

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gradient-to-r from-purple-300 to-pink-300 p-4 rounded-t-2xl shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-2 bg-white rounded-full mr-3">
            <MessageSquare className="text-purple-500" size={24} />
          </div>
          <div>
            <h1 className="font-medium text-lg text-white">ChatAssist</h1>
            <p className="text-purple-100 text-sm">Upload images, capture screens, or just chat</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={clearMessages}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          title="Clear Chat"
        >
          <Trash2 size={20} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ChatHeader;