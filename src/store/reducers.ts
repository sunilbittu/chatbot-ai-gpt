import { combineReducers } from 'redux';
import {
  ChatState,
  ChatActionTypes,
  ADD_MESSAGE_SUCCESS,
  ADD_SYSTEM_MESSAGE,
  CLEAR_MESSAGES,
  SET_TYPING,
  TOGGLE_SLACK
} from './types';
import { generateId } from '../utils/helpers';

const initialState: ChatState = {
  messages: [{
    id: generateId(),
    content: "Hi there! I'm your AI assistant. You can send me text messages or share images, and I'll help analyze and discuss them with you. How can I help you today?",
    type: 'text',
    sender: 'bot',
    timestamp: new Date(),
    status: 'read'
  }],
  isTyping: false,
  slackEnabled: false
};

const chatReducer = (state = initialState, action: ChatActionTypes): ChatState => {
  switch (action.type) {
    case ADD_MESSAGE_SUCCESS:
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };
    
    case ADD_SYSTEM_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, {
          id: generateId(),
          content: action.payload,
          type: 'text',
          sender: 'system',
          timestamp: new Date(),
          status: 'sent'
        }]
      };
    
    case CLEAR_MESSAGES:
      return {
        ...state,
        messages: [initialState.messages[0]]
      };
    
    case SET_TYPING:
      return {
        ...state,
        isTyping: action.payload
      };
    
    case TOGGLE_SLACK:
      return {
        ...state,
        slackEnabled: !state.slackEnabled
      };
    
    default:
      return state;
  }
};

export const rootReducer = combineReducers({
  chat: chatReducer
});