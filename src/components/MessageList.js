import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/MessageList.module.css';

const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ImagePreview = ({ src, onClose }) => {
  return (
    <div className={styles.imagePreviewOverlay} onClick={onClose}>
      <div className={styles.imagePreviewContainer}>
        <img src={src} alt="Büyük görünüm" className={styles.previewImage} />
        <button className={styles.closeButton} onClick={onClose}>✕</button>
      </div>
    </div>
  );
};

const MessageContent = ({ message, onImageClick }) => {
  switch (message.type) {
    case 'image':
      return (
        <div className={styles.imageContainer}>
          <img 
            src={message.content} 
            alt="Gönderilen resim" 
            className={styles.imageMessage}
            onClick={() => onImageClick(message.content)}
          />
        </div>
      );
    case 'audio':
      return (
        <div className={styles.audioContainer}>
          <audio controls className={styles.audioPlayer}>
            <source src={message.content} type="audio/wav" />
            Tarayıcınız ses oynatmayı desteklemiyor.
          </audio>
        </div>
      );
    default:
      return <div className={styles.text}>{message.content}</div>;
  }
};

const MessageList = ({ messages, currentUser }) => {
  const messagesEndRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={styles.messageList}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`${styles.message} ${
            message.type === 'system' ? styles.system : 
              message.username === currentUser ? styles.sent : styles.received
          }`}
        >
          <div className={styles.messageContent}>
            {message.type !== 'system' && (
              <div className={styles.messageHeader}>
                <span className={`${styles.author} ${message.username === currentUser ? styles.authorSent : ''}`}>
                  {message.username}
                </span>
                <span className={styles.timestamp}>{formatTime(message.timestamp)}</span>
              </div>
            )}
            <MessageContent 
              message={message} 
              onImageClick={(imageSrc) => setSelectedImage(imageSrc)}
            />
          </div>
        </div>
      ))}
      {selectedImage && (
        <ImagePreview
          src={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
