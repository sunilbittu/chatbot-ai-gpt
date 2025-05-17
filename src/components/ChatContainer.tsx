import React from 'react';
import { motion } from 'framer-motion';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import InputArea from './InputArea';
import { ChatProvider } from '../context/ChatContext';

const ChatContainer: React.FC = () => {
  return (
    <ChatProvider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="chat-container"
      >
        <ChatHeader />
        <MessageList />
        <InputArea />
      </motion.div>
    </ChatProvider>
  );
};

export default ChatContainer;