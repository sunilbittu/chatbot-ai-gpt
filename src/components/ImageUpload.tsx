import React, { useCallback, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Image as ImageIcon } from 'lucide-react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { addMessage } from '../store/actions';

const ImageUpload: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isUploading, setIsUploading] = useState(false);

  const handleImage = useCallback((file: File) => {
    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      dispatch(addMessage(dataUrl, 'image'));
      setIsUploading(false);
    };
    
    reader.readAsDataURL(file);
  }, [dispatch]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      handleImage(file);
    }
  }, [handleImage]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true
  });

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            handleImage(file);
            break;
          }
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [handleImage]);

  return (
    <div {...getRootProps()} className="image-upload">
      <input {...getInputProps()} />
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`image-upload__button ${
          isDragActive ? 'image-upload__button--drag-active' :
          isUploading ? 'image-upload__button--uploading' :
          ''
        }`}
        onClick={open}
        disabled={isUploading}
        title="Upload or Paste Image"
      >
        <ImageIcon size={20} />
      </motion.button>
      {isDragActive && (
        <div className="image-upload__drag-indicator">
          Drop image here
        </div>
      )}
    </div>
  );
};

export default ImageUpload;