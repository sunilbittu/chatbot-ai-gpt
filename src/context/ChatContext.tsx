import React, { createContext, useContext, ReactNode } from 'react';
import { ChatContextType } from '../types';
import { useChatMessages } from '../hooks/useChatMessages';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { 
    messages, 
    addMessage, 
    addSystemMessage, 
    clearMessages, 
    isTyping, 
    messagesEndRef,
    slackEnabled,
    toggleSlack 
  } = useChatMessages();

  return (
    <ChatContext.Provider value={{ 
      messages, 
      addMessage, 
      addSystemMessage, 
      clearMessages, 
      isTyping,
      slackEnabled,
      toggleSlack
    }}>
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