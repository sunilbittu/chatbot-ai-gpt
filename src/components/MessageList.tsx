import React from 'react';
import { AnimatePresence } from 'framer-motion';
import MessageItem from './MessageItem';
import TypingIndicator from './TypingIndicator';
import { useChat } from '../context/ChatContext';

const MessageList: React.FC = () => {
  const { messages, isTyping } = useChat();

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="flex flex-col">
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