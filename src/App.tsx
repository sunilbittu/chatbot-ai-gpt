import React from 'react';
import { motion } from 'framer-motion';
import ChatContainer from './components/ChatContainer';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 flex flex-col items-center justify-center p-4">
      <ChatContainer />
    </div>
  );
}

export default App;