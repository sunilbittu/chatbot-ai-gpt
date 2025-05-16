import React, { useState, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, Maximize2, Minimize2 } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import ImageUpload from './ImageUpload';

const InputArea: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isDetailed, setIsDetailed] = useState(false);
  const { addMessage } = useChat();

  const handleSendMessage = () => {
    if (message.trim()) {
      const detailedPrefix = isDetailed ? "Please provide a detailed analysis of the following: " : "";
      addMessage(detailedPrefix + message.trim(), 'text');
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
    <div className="border-t border-gray-100 bg-white p-4">
      <div className="flex items-end gap-2">
        <ImageUpload />
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsDetailed(!isDetailed)}
          className={`p-2 rounded-full ${
            isDetailed 
              ? 'bg-green-100 text-green-600' 
              : 'bg-gray-100 text-gray-600'
          }`}
          title={isDetailed ? "Detailed Analysis Mode" : "Normal Mode"}
        >
          {isDetailed ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </motion.button>
        
        <div className="flex-1 bg-gray-100 rounded-2xl p-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isDetailed ? "Ask for detailed analysis..." : "Type a message..."}
            className="w-full bg-transparent border-none outline-none resize-none min-h-[40px] max-h-[120px]"
            rows={1}
          />
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`p-3 rounded-full ${
            message.trim()
              ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white'
              : 'bg-gray-200 text-gray-400'
          }`}
          onClick={handleSendMessage}
          disabled={!message.trim()}
        >
          <Send size={20} />
        </motion.button>
      </div>
      {isDetailed && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          Detailed analysis mode enabled - Responses will be more comprehensive
        </div>
      )}
    </div>
  );
};

export default InputArea;