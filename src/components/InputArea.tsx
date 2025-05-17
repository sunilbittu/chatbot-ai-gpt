import React, { useState, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, Maximize2, Minimize2 } from 'lucide-react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { addMessage } from '../store/actions';
import ImageUpload from './ImageUpload';

const InputArea: React.FC = () => {
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState('');
  const [isDetailed, setIsDetailed] = useState(false);

  const handleSendMessage = () => {
    if (message.trim()) {
      const detailedPrefix = isDetailed ? "Please provide a detailed analysis of the following: " : "";
      dispatch(addMessage(detailedPrefix + message.trim(), 'text'));
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="input-area">
      <div className="input-area__container">
        <ImageUpload />
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsDetailed(!isDetailed)}
          className={`input-area__mode-button ${isDetailed ? 'input-area__mode-button--active' : ''}`}
          title={isDetailed ? "Detailed Analysis Mode" : "Normal Mode"}
        >
          {isDetailed ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </motion.button>
        
        <div className="input-area__input-wrapper">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isDetailed ? "Ask for detailed analysis..." : "Type a message..."}
            className="input-area__input"
            rows={1}
          />
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`input-area__send-button ${message.trim() ? 'input-area__send-button--active' : ''}`}
          onClick={handleSendMessage}
          disabled={!message.trim()}
        >
          <Send size={20} />
        </motion.button>
      </div>
      {isDetailed && (
        <div className="input-area__mode-indicator">
          Detailed analysis mode enabled - Responses will be more comprehensive
        </div>
      )}
    </div>
  );
};

export default InputArea;