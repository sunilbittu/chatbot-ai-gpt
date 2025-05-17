import React from 'react';
import { AnimatePresence } from 'framer-motion';
import MessageItem from './MessageItem';
import TypingIndicator from './TypingIndicator';
import { useChat } from '../context/ChatContext';

const MessageList: React.FC = () => {
  const { messages, isTyping } = useChat();

  return (
    <div className="chat-messages">
      <div className="chat-messages__container">
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
        <AnimatePresence>
          {isTyping && <TypingIndicator />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MessageList;