import { useState, useCallback, useEffect, useRef } from 'react';
import { Message, MessageType, SlackConfig } from '../types';
import { generateId, delay, getBotResponse } from '../utils/helpers';
import { createSlackChannel, postToSlack } from '../utils/slack';

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
  const [slackConfig, setSlackConfig] = useState<SlackConfig>({ enabled: false });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleSlack = useCallback(() => {
    setSlackConfig(prev => ({ ...prev, enabled: !prev.enabled }));
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([{
      id: generateId(),
      content: "Hi there! I'm your AI assistant. You can send me text messages or share images, and I'll help analyze and discuss them with you. How can I help you today?",
      type: 'text',
      sender: 'bot',
      timestamp: new Date(),
      status: 'read'
    }]);
    setSlackConfig(prev => ({ ...prev, channelId: undefined }));
  }, []);

  const addSystemMessage = useCallback((content: string) => {
    const systemMessage: Message = {
      id: generateId(),
      content,
      type: 'text',
      sender: 'system',
      timestamp: new Date(),
      status: 'sent'
    };
    setMessages(prev => [...prev, systemMessage]);
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
    
    if (slackConfig.enabled && !slackConfig.channelId) {
      const channelId = await createSlackChannel(`chat-${generateId()}`);
      if (channelId) {
        setSlackConfig(prev => ({ ...prev, channelId }));
      }
    }

    await delay(500);
    setMessages(prev => prev.map(msg => 
      msg.id === userMessage.id ? { ...msg, status: 'sent' } : msg
    ));

    await delay(500);
    setMessages(prev => prev.map(msg => 
      msg.id === userMessage.id ? { ...msg, status: 'delivered' } : msg
    ));

    if (slackConfig.enabled && slackConfig.channelId) {
      await postToSlack(slackConfig.channelId, content, 'User');
    }

    setIsTyping(true);

    let botResponse;
    if (type === 'image') {
      botResponse = await getBotResponse("", content);
    } else {
      botResponse = await getBotResponse(content);
    }
    
    setIsTyping(false);

    const botMessage: Message = {
      id: generateId(),
      content: botResponse.content,
      type: botResponse.type,
      sender: botResponse.type === 'error' ? 'system' : 'bot',
      timestamp: new Date(),
      status: 'sent',
      error: botResponse.type === 'error'
    };
    
    setMessages(prev => [...prev, botMessage]);

    if (slackConfig.enabled && slackConfig.channelId) {
      await postToSlack(slackConfig.channelId, botResponse.content, 'Assistant');
    }

    await delay(500);
    setMessages(prev => prev.map(msg => 
      msg.id === userMessage.id ? { ...msg, status: 'read' } : msg
    ));
  }, [slackConfig]);

  return { 
    messages, 
    addMessage, 
    addSystemMessage, 
    clearMessages, 
    isTyping, 
    messagesEndRef,
    slackEnabled: slackConfig.enabled,
    toggleSlack
  };
};