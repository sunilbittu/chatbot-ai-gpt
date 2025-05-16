export type MessageType = 'text' | 'image';

export interface Message {
  id: string;
  content: string;
  type: MessageType;
  sender: 'user' | 'bot';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

export interface ChatContextType {
  messages: Message[];
  addMessage: (content: string, type: MessageType) => void;
  isTyping: boolean;
}