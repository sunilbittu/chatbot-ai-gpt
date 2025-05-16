import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Trash2, MessageCircleMore, FileDown } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { exportToPDF } from '../utils/pdf';

const ChatHeader: React.FC = () => {
  const { clearMessages, slackEnabled, toggleSlack, messages } = useChat();

  const handleExport = () => {
    exportToPDF(messages);
  };

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gradient-to-r from-blue-300 to-green-300 p-4 rounded-t-2xl shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-2 bg-white rounded-full mr-3">
            <MessageSquare className="text-blue-500" size={24} />
          </div>
          <div>
            <h1 className="font-medium text-lg text-white">ChatAssist</h1>
            <p className="text-blue-100 text-sm">Upload images, capture screens, or just chat</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleExport}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            title="Export to PDF"
          >
            <FileDown size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSlack}
            className={`p-2 rounded-full transition-colors ${
              slackEnabled 
                ? 'bg-green-400 text-white' 
                : 'bg-white/10 text-white'
            }`}
            title={slackEnabled ? "Slack Connected" : "Connect to Slack"}
          >
            <MessageCircleMore size={20} />
          </motion.button>
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
      </div>
    </motion.div>
  );
};

export default ChatHeader;