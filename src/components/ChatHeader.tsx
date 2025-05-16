import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

const ChatHeader: React.FC = () => {
  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gradient-to-r from-purple-300 to-pink-300 p-4 rounded-t-2xl shadow-sm"
    >
      <div className="flex items-center">
        <div className="p-2 bg-white rounded-full mr-3">
          <MessageSquare className="text-purple-500" size={24} />
        </div>
        <div>
          <h1 className="font-medium text-lg text-white">ChatAssist</h1>
          <p className="text-purple-100 text-sm">Upload images, capture screens, or just chat</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatHeader;