export type MessageType = 'text' | 'image' | 'error';

export interface Message {
  id: string;
  content: string;
  type: MessageType;
  sender: 'user' | 'bot' | 'system';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  error?: boolean;
}

export interface ChatContextType {
  messages: Message[];
  addMessage: (content: string, type: MessageType) => void;
  addSystemMessage: (content: string) => void;
  clearMessages: () => void;
  isTyping: boolean;
  slackEnabled: boolean;
  toggleSlack: () => void;
}

export interface SlackConfig {
  enabled: boolean;
  channelId?: string;
}