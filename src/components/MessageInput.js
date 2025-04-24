import React, { useState, useRef } from 'react';
import styles from '../styles/MessageInput.module.css';
import EmojiPicker from './EmojiPicker';

const MessageInput = ({ onSend }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Dosya boyutu çok büyük. Lütfen 5MB\'dan küçük bir dosya seçin.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        onSend({
          type: 'image',
          content: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowImageOptions(false);
      }
    } catch (error) {
      console.error('Kameraya erişilemedi:', error);
      alert('Kameraya erişilemedi. Lütfen kamera izinlerini kontrol edin.');
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      
      const imageData = canvasRef.current.toDataURL('image/jpeg');
      onSend({
        type: 'image',
        content: imageData
      });

      // Kamerayı kapat
      const stream = videoRef.current.srcObject;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.onloadend = () => {
          onSend({
            type: 'audio',
            content: reader.result
          });
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);

      // Timer for recording duration
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Mikrofona erişilemedi. Lütfen mikrofon izinlerini kontrol edin.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
      setRecordingTime(0);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSend({
        type: 'text',
        content: message.trim()
      });
      setMessage('');
      setShowEmojiPicker(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.inputContainer}>
      {showEmojiPicker && (
        <EmojiPicker 
          onEmojiSelect={handleEmojiSelect}
        />
      )}
      <div className={styles.mediaPreview}>
        {videoRef.current?.srcObject && (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={styles.cameraPreview}
            />
            <button
              className={styles.captureButton}
              onClick={captureImage}
            >
              📸 Çek
            </button>
          </>
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
      <form className={styles.inputForm} onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        <div className={styles.imageOptionsContainer}>
          <button
            type="button"
            className={`${styles.mediaButton} ${showImageOptions ? styles.active : ''}`}
            onClick={() => setShowImageOptions(!showImageOptions)}
            aria-label="Resim seçenekleri"
          >
            📷
          </button>
          {showImageOptions && (
            <div className={styles.imageOptions}>
              <button
                type="button"
                className={styles.imageOptionButton}
                onClick={() => {
                  fileInputRef.current.click();
                  setShowImageOptions(false);
                }}
              >
                📤 Fotoğraf Yükle
              </button>
              <button
                type="button"
                className={styles.imageOptionButton}
                onClick={startCamera}
              >
                📸 Fotoğraf Çek
              </button>
            </div>
          )}
        </div>
        <button
          type="button"
          className={`${styles.mediaButton} ${isRecording ? styles.recording : ''}`}
          onClick={isRecording ? stopRecording : startRecording}
          aria-label={isRecording ? 'Kaydı durdur' : 'Sesli mesaj kaydet'}
        >
          🎤 {isRecording && formatTime(recordingTime)}
        </button>
        <button
          type="button"
          className={`${styles.mediaButton} ${showEmojiPicker ? styles.active : ''}`}
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          aria-label="Emoji seç"
        >
          😊
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Mesajınızı yazın..."
          className={styles.input}
          disabled={isRecording}
        />
        <button type="submit" className={styles.sendButton} aria-label="Mesaj gönder">
          →
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
