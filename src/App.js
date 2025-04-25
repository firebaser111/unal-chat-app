import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import ConnectionForm from './components/ConnectionForm';
import ChatWindow from './components/ChatWindow';
import config from './config';

function App() {
  const [connected, setConnected] = useState(false);
  const [ws, setWs] = useState(null);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [retries, setRetries] = useState(0);
  const MAX_RETRIES = 3;
  const RETRY_TIMEOUT = 2000;

  const validateWebSocketUrl = (url) => {
    try {
      const wsUrl = new URL(url);
      if (!['ws:', 'wss:'].includes(wsUrl.protocol)) {
        throw new Error('Invalid WebSocket protocol. Use ws:// or wss://');
      }
      return true;
    } catch (err) {
      setError(`Invalid WebSocket URL: ${err.message}`);
      return false;
    }
  };

  const connectToWebSocket = useCallback((serverUrl) => {
    if (!validateWebSocketUrl(serverUrl)) {
      return null;
    }

    try {
      console.log(`Attempting to connect to ${serverUrl}`);
      const websocket = new WebSocket(serverUrl);
      
      const connectionTimeout = setTimeout(() => {
        if (websocket && websocket.readyState !== WebSocket.OPEN) {
          websocket.close();
          setError(`Connection timeout. Server ${serverUrl} is not responding`);
          
          if (retries < MAX_RETRIES) {
            console.log(`Retrying connection (${retries + 1}/${MAX_RETRIES})`);
            setRetries(prev => prev + 1);
            setTimeout(() => connectToWebSocket(serverUrl), RETRY_TIMEOUT * Math.pow(2, retries));
          } else {
            console.log('Max retries reached');
            setError('Failed to connect after maximum retry attempts');
          }
        }
      }, 5000);

      websocket.onopen = () => {
        clearTimeout(connectionTimeout);
        setRetries(0);
        setError('');
        setWs(websocket);
        setConnected(true);
      };

      websocket.onclose = () => {
        clearTimeout(connectionTimeout);
        setError('Connection closed');
        setConnected(false);
        setWs(null);
        
        if (retries < MAX_RETRIES) {
          setRetries(prev => prev + 1);
          setTimeout(() => connectToWebSocket(serverUrl), RETRY_TIMEOUT * Math.pow(2, retries));
        }
      };

      websocket.onerror = (error) => {
        clearTimeout(connectionTimeout);
        setError(`WebSocket error: ${error.message || 'Unknown error'}`);
        websocket.close();
      };

      return websocket;
    } catch (err) {
      const errorMessage = `Connection failed: ${err.message}. Make sure the WebSocket server is running at ${serverUrl}`;
      console.error(errorMessage);
      setError(errorMessage);
      return null;
    }
  }, [retries]);

  useEffect(() => {
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [ws]);

  const handleConnect = (serverUrl, username) => {
    setUsername(username);
    connectToWebSocket(serverUrl);
  };

  return (
    <div className="App">
      {!connected ? (
        <>
          <ConnectionForm onConnect={handleConnect} defaultServerUrl={config.websocketUrl} />
          {error && <div className="error-message">
            {error}
            {retries > 0 && ` (Retry attempt ${retries}/${MAX_RETRIES})`}
          </div>}
        </>
      ) : (
        <ChatWindow ws={ws} username={username} />
      )}
    </div>
  );
}

export default App;
