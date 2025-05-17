import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="message message--bot"
    >
      <div className="message__content">
        <div className="typing-indicator">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="typing-indicator__dot"
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: 1,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;