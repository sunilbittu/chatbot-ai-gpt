import {
  ADD_MESSAGE,
  ADD_SYSTEM_MESSAGE,
  CLEAR_MESSAGES,
  SET_TYPING,
  TOGGLE_SLACK,
  MessageType
} from './types';

export const addMessage = (content: string, messageType: MessageType) => ({
  type: ADD_MESSAGE,
  payload: { content, messageType }
});

export const addSystemMessage = (content: string) => ({
  type: ADD_SYSTEM_MESSAGE,
  payload: content
});

export const clearMessages = () => ({
  type: CLEAR_MESSAGES
});

export const setTyping = (isTyping: boolean) => ({
  type: SET_TYPING,
  payload: isTyping
});

export const toggleSlack = () => ({
  type: TOGGLE_SLACK
});