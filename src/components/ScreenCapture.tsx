import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { Camera } from 'lucide-react';
import { useChat } from '../context/ChatContext';

const ScreenCapture: React.FC = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [endPos, setEndPos] = useState({ x: 0, y: 0 });
  const selectionRef = useRef<HTMLDivElement>(null);
  const { addMessage } = useChat();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isSelecting) {
        setEndPos({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = async () => {
      if (isSelecting) {
        setIsSelecting(false);
        await captureSelectedArea();
      }
    };

    if (isSelecting) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isSelecting, startPos]);

  const startSelection = () => {
    setIsCapturing(true);
    
    const handleMouseDown = (e: MouseEvent) => {
      setStartPos({ x: e.clientX, y: e.clientY });
      setEndPos({ x: e.clientX, y: e.clientY });
      setIsSelecting(true);
      document.removeEventListener('mousedown', handleMouseDown);
    };

    document.addEventListener('mousedown', handleMouseDown);
  };

  const getSelectionStyles = () => {
    if (!isSelecting) return null;

    const left = Math.min(startPos.x, endPos.x);
    const top = Math.min(startPos.y, endPos.y);
    const width = Math.abs(endPos.x - startPos.x);
    const height = Math.abs(endPos.y - startPos.y);

    return {
      position: 'fixed',
      left,
      top,
      width,
      height,
      border: '2px dashed #0ea5e9',
      backgroundColor: 'rgba(14, 165, 233, 0.1)',
      pointerEvents: 'none',
      zIndex: 9999,
    } as React.CSSProperties;
  };

  const captureSelectedArea = async () => {
    if (!isCapturing) return;
    
    try {
      const left = Math.min(startPos.x, endPos.x);
      const top = Math.min(startPos.y, endPos.y);
      const width = Math.abs(endPos.x - startPos.x);
      const height = Math.abs(endPos.y - startPos.y);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('Could not get canvas context');

      const fullCanvas = await html2canvas(document.body, {
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      ctx.drawImage(
        fullCanvas,
        left + window.scrollX,
        top + window.scrollY,
        width,
        height,
        0,
        0,
        width,
        height
      );

      const screenshotDataUrl = canvas.toDataURL('image/png');
      addMessage(screenshotDataUrl, 'screenshot');
    } catch (error) {
      console.error('Error capturing screen:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`p-2 rounded-full ${
          isCapturing ? 'bg-green-200 text-green-600' : 'bg-blue-100 text-blue-600'
        }`}
        onClick={startSelection}
        disabled={isCapturing}
        title="Capture Screen Area"
      >
        <Camera size={20} />
      </motion.button>
      
      {isSelecting && (
        <div
          ref={selectionRef}
          style={getSelectionStyles()}
        />
      )}
      
      {isCapturing && !isSelecting && (
        <div className="fixed inset-0 bg-black bg-opacity-30 cursor-crosshair z-50">
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full text-sm">
            Click and drag to select an area
          </div>
        </div>
      )}
    </>
  );
};

export default ScreenCapture;