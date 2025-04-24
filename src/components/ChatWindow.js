import React, { useState, useEffect, useRef } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import UserList from './UserList';
import styles from '../styles/ChatWindow.module.css';

function ChatWindow({ ws, username }) {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedSection, setSelectedSection] = useState('people');
  const hasJoinedRef = useRef(false);

  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'update') {
          setMessages(data.messages.map(msg => ({
            ...msg,
            id: msg.id || Date.now() + Math.random()
          })));
        }
      };

      // Sadece ilk seferinde katılma mesajı gönder
      if (!hasJoinedRef.current) {
        ws.send(JSON.stringify({
          type: 'system',
          username: 'Sistem',
          content: `${username} sohbete katıldı`,
          id: Date.now() + Math.random()
        }));
        hasJoinedRef.current = true;
      }

      // Cleanup function
      return () => {
        if (hasJoinedRef.current) {
          ws.send(JSON.stringify({
            type: 'system',
            username: 'Sistem',
            content: `${username} sohbetten ayrıldı`,
            id: Date.now() + Math.random()
          }));
          hasJoinedRef.current = false;
        }
      };
    }
  }, [ws, username]);

  const sendMessage = (messageData) => {
    if (ws) {
      const message = {
        type: messageData.type || 'text',
        username: username,
        content: messageData.content,
        timestamp: new Date().toISOString()
      };
      ws.send(JSON.stringify(message));
    }
  };

  const renderSidebar = () => {
    switch (selectedSection) {
      case 'people':
        return <UserList users={[...new Set([username, ...users])]} />;
      case 'photos':
        return <div className={styles.menuItem}>No photos yet</div>;
      case 'options':
        return <div className={styles.menuItem}>No options available</div>;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.chatWindow}>
        <div className={styles.header}>
          <h1>Ünal Ailesi Sohbet</h1>
          <div className={styles.copyright}>© Sait Ümit ÜNAL</div>
        </div>
        <div className={styles.chatArea}>
          <div className={styles.messagesContainer}>
            <MessageList messages={messages} currentUser={username} />
            <MessageInput onSend={sendMessage} />
          </div>
          <div className={styles.sidebar}>
            <div 
              className={styles.menuItem} 
              onClick={() => setSelectedSection('people')}
            >
              People
            </div>
            <div 
              className={styles.menuItem} 
              onClick={() => setSelectedSection('photos')}
            >
              Photos
            </div>
            <div 
              className={styles.menuItem} 
              onClick={() => setSelectedSection('options')}
            >
              Options
            </div>
            {renderSidebar()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;