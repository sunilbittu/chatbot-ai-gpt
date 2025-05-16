import { useState, useCallback, useEffect, useRef } from 'react';
import { Message, MessageType } from '../types';
import { generateId, delay, getBotResponse } from '../utils/helpers';

export const useChatMessages = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      content: "Hi there! I'm your AI assistant. You can send me text messages or share images, and I'll help analyze and discuss them with you. How can I help you today?",
      type: 'text',
      sender: 'bot',
      timestamp: new Date(),
      status: 'read'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const clearMessages = useCallback(() => {
    setMessages([{
      id: generateId(),
      content: "Hi there! I'm your AI assistant. You can send me text messages or share images, and I'll help analyze and discuss them with you. How can I help you today?",
      type: 'text',
      sender: 'bot',
      timestamp: new Date(),
      status: 'read'
    }]);
  }, []);

  const addMessage = useCallback(async (content: string, type: MessageType) => {
    const userMessage: Message = {
      id: generateId(),
      content,
      type,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Update status to sent after a short delay
    await delay(500);
    setMessages(prev => prev.map(msg => 
      msg.id === userMessage.id ? { ...msg, status: 'sent' } : msg
    ));

    // Update status to delivered after another delay
    await delay(500);
    setMessages(prev => prev.map(msg => 
      msg.id === userMessage.id ? { ...msg, status: 'delivered' } : msg
    ));

    // Bot starts typing
    setIsTyping(true);

    // Get bot response
    let botResponse: string;
    if (type === 'image') {
      botResponse = await getBotResponse("", content);
    } else {
      botResponse = await getBotResponse(content);
    }
    
    // Bot stops typing and sends response
    setIsTyping(false);

    const botMessage: Message = {
      id: generateId(),
      content: botResponse,
      type: 'text',
      sender: 'bot',
      timestamp: new Date(),
      status: 'sent'
    };
    
    setMessages(prev => [...prev, botMessage]);

    // Update user message to read
    await delay(500);
    setMessages(prev => prev.map(msg => 
      msg.id === userMessage.id ? { ...msg, status: 'read' } : msg
    ));
  }, []);

  return { messages, addMessage, clearMessages, isTyping, messagesEndRef };
};