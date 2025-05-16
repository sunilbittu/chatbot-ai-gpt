import React, { createContext, useContext, ReactNode } from 'react';
import { ChatContextType } from '../types';
import { useChatMessages } from '../hooks/useChatMessages';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { messages, addMessage, isTyping, messagesEndRef } = useChatMessages();

  return (
    <ChatContext.Provider value={{ messages, addMessage, isTyping }}>
      {children}
      <div ref={messagesEndRef} />
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};