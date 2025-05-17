import { takeEvery, put, call, delay } from 'redux-saga/effects';
import {
  ADD_MESSAGE,
  ADD_MESSAGE_SUCCESS,
  AddMessageAction
} from './types';
import { setTyping } from './actions';
import { generateId } from '../utils/helpers';
import { getBotResponse } from '../utils/helpers';
import { createSlackChannel, postToSlack } from '../utils/slack';

function* handleAddMessage(action: AddMessageAction) {
  const { content, messageType } = action.payload;
  const messageId = generateId();
  
  // Add initial user message
  yield put({
    type: ADD_MESSAGE_SUCCESS,
    payload: {
      id: messageId,
      content,
      type: messageType,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending'
    }
  });

  // Update message status
  yield delay(500);
  yield put({
    type: 'UPDATE_MESSAGE_STATUS',
    payload: {
      id: messageId,
      status: 'sent'
    }
  });

  yield delay(500);
  yield put({
    type: 'UPDATE_MESSAGE_STATUS',
    payload: {
      id: messageId,
      status: 'delivered'
    }
  });

  // Set typing indicator before getting bot response
  yield put(setTyping(true));
  
  try {
    const botResponse = yield call(getBotResponse, content, messageType === 'image' ? content : undefined);
    
    // Small delay to ensure typing indicator is visible
    yield delay(1000);
    
    yield put({
      type: ADD_MESSAGE_SUCCESS,
      payload: {
        id: generateId(),
        content: botResponse.content,
        type: botResponse.type,
        sender: botResponse.type === 'error' ? 'system' : 'bot',
        timestamp: new Date(),
        status: 'sent',
        error: botResponse.type === 'error'
      }
    });

    // Mark user message as read after bot responds
    yield put({
      type: 'UPDATE_MESSAGE_STATUS',
      payload: {
        id: messageId,
        status: 'read'
      }
    });
  } catch (error) {
    yield put({
      type: ADD_MESSAGE_SUCCESS,
      payload: {
        id: generateId(),
        content: 'Sorry, I encountered an error processing your request.',
        type: 'error',
        sender: 'system',
        timestamp: new Date(),
        status: 'sent',
        error: true
      }
    });
  } finally {
    // Ensure typing indicator is hidden after response
    yield delay(500);
    yield put(setTyping(false));
  }
}

export function* rootSaga() {
  yield takeEvery(ADD_MESSAGE, handleAddMessage);
}