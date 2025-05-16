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
// Reduced context length to prevent token limit issues
const MAX_CONTEXT_LENGTH = 2; // Reduced from 4 to 2

let conversationHistory: { role: 'user' | 'assistant'; content: string }[] = [];

const updateConversationHistory = (role: 'user' | 'assistant', content: string) => {
  conversationHistory.push({ role, content });
  // Keep only the most recent messages
  if (conversationHistory.length > MAX_CONTEXT_LENGTH * 2) {
    conversationHistory = conversationHistory.slice(-MAX_CONTEXT_LENGTH * 2);
  }
};

const handleAPIError = async (error: any): Promise<string> => {
  if (error.response?.status === 429) {
    // Clear conversation history on rate limit to reduce token count
    conversationHistory = [];
    return "I apologize, but I've received too many messages. Let's start a new conversation.";
  }
  console.error('Error getting bot response:', error.response?.data || error);
  return "I apologize, but I'm having trouble processing your request at the moment. Please try again later.";
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
    
    if (imageUrl) {
      console.log(imageUrl)
    // More context-specific prompt for APM application
    const imageContext = message || 'Analyze this screenshot for UI issues and potential performance problems.';
      

    messages.push({
        role: 'user',
        content: `${imageContext}\n\nImage URL: ${imageUrl}\nPage Type: Dashboard\nExpected State: Fully loaded with all graphs visible`
    });
} else {
    messages.push({ role: 'user', content: message });
}

    const isDetailedRequest = message.includes("detailed") || message.includes("in-depth");
const maxTokens = isDetailedRequest ? 800 : 400;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages,
      max_tokens: 600, // Reduced from 300 to 200
      temperature: 0.5,
    });

    const response = completion.choices[0]?.message?.content || 'I apologize, but I cannot process your request at the moment.';
    
    updateConversationHistory('user', message);
    updateConversationHistory('assistant', response);

    return response;
  } catch (error: any) {
    return handleAPIError(error);
  }
};