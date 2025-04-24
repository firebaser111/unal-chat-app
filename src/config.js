const config = {
  websocketUrl: process.env.NODE_ENV === 'production'
    ? 'wss://unal-chat-server.onrender.com'  // Production WebSocket URL
    : 'ws://localhost:8080'  // Development WebSocket URL
};

export default config;