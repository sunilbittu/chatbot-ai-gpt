import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, MessageCircleMore, FileDown } from 'lucide-react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { clearMessages, toggleSlack } from '../store/actions';
import { exportToPDF } from '../utils/pdf';

const ChatHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const { messages, slackEnabled } = useAppSelector(state => state.chat);

  const handleExport = () => {
    exportToPDF(messages);
  };

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="chat-header"
    >
      <div className="chat-header__content">
        <div className="chat-header__logo">
          <div>
            <h1 className="chat-header__title">ChatAssist</h1>
            <p className="chat-header__subtitle">Upload images, capture screens, or just chat</p>
          </div>
        </div>
        <div className="chat-header__actions">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleExport}
            className="chat-header__button"
            title="Export to PDF"
          >
            <FileDown size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => dispatch(toggleSlack())}
            className={`chat-header__button ${slackEnabled ? 'chat-header__button--active' : ''}`}
            title={slackEnabled ? "Slack Connected" : "Connect to Slack"}
          >
            <MessageCircleMore size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => dispatch(clearMessages())}
            className="chat-header__button"
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