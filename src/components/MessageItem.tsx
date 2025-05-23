import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, CheckCheck, Flag, MessageCircle, Loader2, Copy } from 'lucide-react';
import { Message } from '../types';
import { formatTimestamp } from '../utils/helpers';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { addSystemMessage } from '../store/actions';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const dispatch = useAppDispatch();
  const messages = useAppSelector(state => state.chat.messages);
  const isUser = message.sender === 'user';
  const [isReporting, setIsReporting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  const handleReportIssue = async () => {
    setIsReporting(true);
    try {
      const conversationContext = messages
        .slice(-5)
        .map(msg => `${msg.sender.toUpperCase()}: ${msg.content}`)
        .join('\n\n');

      const issueReport = `# Issue Report\n\n## Recent Conversation\n${conversationContext}`;

      dispatch(addSystemMessage("Unable to connect to Jira. Here's the issue report for reference:\n\n" + issueReport));
    } finally {
      setIsReporting(false);
    }
  };

  const handleContinueChat = () => {
    dispatch(addSystemMessage("Let's continue our conversation."));
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`message ${isUser ? 'message--user' : 'message--bot'}`}
    >
      <div className="message__content">
        {message.type === 'image' ? (
          <img 
            src={message.content} 
            alt="User uploaded"
            className="message__image"
          />
        ) : (
          <>
            <p>{message.content}</p>
            <button
              onClick={handleCopyMessage}
              className="message__copy-button"
              title={isCopied ? "Copied!" : "Copy message"}
            >
              <Copy size={14} className={isCopied ? "message__copy-icon--success" : ""} />
            </button>
          </>
        )}
        
        {message.sender === 'bot' && (
          <div className="message__actions">
            <button
              onClick={handleReportIssue}
              disabled={isReporting}
              className="message__action-button"
              title="Report Issue"
            >
              {isReporting ? (
                <Loader2 size={14} className="message__action-icon--spin" />
              ) : (
                <Flag size={14} />
              )}
            </button>
            <button
              onClick={handleContinueChat}
              className="message__action-button message__action-button--primary"
              title="Continue Chat"
            >
              <MessageCircle size={14} />
            </button>
          </div>
        )}
      </div>
      <div className="message__meta">
        <span className="message__timestamp">{formatTimestamp(message.timestamp)}</span>
        {message.sender === 'user' && (
          <span className="message__status">
            {message.status === 'sending' && <span className="message__status-dot" />}
            {message.status === 'sent' && <Check size={14} />}
            {message.status === 'delivered' && <CheckCheck size={14} />}
            {message.status === 'read' && <CheckCheck size={14} className="message__status--read" />}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default MessageItem;