import OpenAI from 'openai';

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

export const formatTimestamp = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
};

export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
// Reduced context length to limit token usage
const MAX_CONTEXT_LENGTH = 1;
// Maximum characters for message content to prevent excessive tokens
const MAX_MESSAGE_LENGTH = 2000;

let conversationHistory: { role: 'user' | 'assistant'; content: string }[] = [];

const updateConversationHistory = (role: 'user' | 'assistant', content: string) => {
  conversationHistory.push({ role, content });
  if (conversationHistory.length > MAX_CONTEXT_LENGTH * 2) {
    conversationHistory = conversationHistory.slice(-MAX_CONTEXT_LENGTH * 2);
  }
};

const handleAPIError = async (error: any): Promise<string> => {
  if (error.response?.status === 429) {
    conversationHistory = [];
    return "I apologize, but I've received too many messages or the request was too large. Please try sending a shorter message or starting a new conversation.";
  }
  console.error('Error getting bot response:', error.response?.data || error);
  return "I apologize, but I'm having trouble processing your request at the moment. Please try again later.";
};

const truncateMessage = (message: string): string => {
  if (message.length > MAX_MESSAGE_LENGTH) {
    return message.substring(0, MAX_MESSAGE_LENGTH) + '... (message truncated)';
  }
  return message;
};

export const getBotResponse = async (message: string, imageUrl?: string): Promise<string> => {
  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not found');
    }

    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });

    let messages = [...conversationHistory];
    
    const truncatedMessage = truncateMessage(message);
    
    if (imageUrl) {
      const imageContext = truncatedMessage || 'Analyze this screenshot for UI issues and potential performance problems. Keep it concise';
      messages.push({
        role: 'user',
        content: `${imageContext}\n\nImage URL: ${imageUrl}\nPage Type: Dashboard\nExpected State: Fully loaded with all graphs visible`
      });
    } else {
      messages.push({ role: 'user', content: truncatedMessage });
    }

    const isDetailedRequest = message.toLowerCase().includes("detailed") || message.toLowerCase().includes("in-depth");
    // Reduced max tokens to prevent excessive response lengths
    const maxTokens = isDetailedRequest ? 400 : 200;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || 'I apologize, but I cannot process your request at the moment.';
    
    updateConversationHistory('user', truncatedMessage);
    updateConversationHistory('assistant', response);

    return response;
  } catch (error: any) {
    return handleAPIError(error);
  }
};