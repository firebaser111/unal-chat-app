const config = {
  websocketUrl: process.env.REACT_APP_WS_URL || 
    (process.env.REACT_APP_NODE_ENV === 'production' 
      ? 'wss://unal-chat-server.onrender.com'
      : 'ws://localhost:8080')
};

export default config;