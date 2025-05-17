import { Message, MessageType } from '../types';

export interface RootState {
  chat: ChatState;
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  slackEnabled: boolean;
}

export const ADD_MESSAGE = 'ADD_MESSAGE';
export const ADD_MESSAGE_SUCCESS = 'ADD_MESSAGE_SUCCESS';
export const UPDATE_MESSAGE_STATUS = 'UPDATE_MESSAGE_STATUS';
export const ADD_SYSTEM_MESSAGE = 'ADD_SYSTEM_MESSAGE';
export const CLEAR_MESSAGES = 'CLEAR_MESSAGES';
export const SET_TYPING = 'SET_TYPING';
export const TOGGLE_SLACK = 'TOGGLE_SLACK';

export interface AddMessageAction {
  type: typeof ADD_MESSAGE;
  payload: {
    content: string;
    messageType: MessageType;
  };
}

export interface AddMessageSuccessAction {
  type: typeof ADD_MESSAGE_SUCCESS;
  payload: Message;
}

export interface UpdateMessageStatusAction {
  type: typeof UPDATE_MESSAGE_STATUS;
  payload: {
    id: string;
    status: Message['status'];
  };
}

export interface AddSystemMessageAction {
  type: typeof ADD_SYSTEM_MESSAGE;
  payload: string;
}

export interface ClearMessagesAction {
  type: typeof CLEAR_MESSAGES;
}

export interface SetTypingAction {
  type: typeof SET_TYPING;
  payload: boolean;
}

export interface ToggleSlackAction {
  type: typeof TOGGLE_SLACK;
}

export type ChatActionTypes =
  | AddMessageAction
  | AddMessageSuccessAction
  | UpdateMessageStatusAction
  | AddSystemMessageAction
  | ClearMessagesAction
  | SetTypingAction
  | ToggleSlackAction;