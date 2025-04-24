const WebSocket = require('ws');

const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });
const MESSAGE_LIMIT = 50;
let messageHistory = [];
const connectedUsers = new Map(); // IP ve port bilgisiyle kullanıcıları takip et

const broadcast = (message, sender) => {
  try {
    const parsedMessage = JSON.parse(message);
    
    // Sistem mesajlarını kontrol et
    if (parsedMessage.type === 'system') {
      const username = parsedMessage.content.split(' ')[0];
      const clientKey = `${sender._socket.remoteAddress}:${sender._socket.remotePort}`;
      const isJoining = parsedMessage.content.includes('katıldı');
      
      if (isJoining) {
        if (connectedUsers.has(clientKey)) {
          return; // Kullanıcı zaten bağlı
        }
        connectedUsers.set(clientKey, username);
      } else {
        if (!connectedUsers.has(clientKey)) {
          return; // Kullanıcı zaten bağlı değil
        }
        connectedUsers.delete(clientKey);
      }
    }

    // ID ekle
    if (!parsedMessage.id) {
      parsedMessage.id = Date.now() + Math.random();
    }
    
    // Mesajı geçmişe ekle
    messageHistory.push(parsedMessage);
    
    // Son 50 mesajı tut
    if (messageHistory.length > MESSAGE_LIMIT) {
      messageHistory = messageHistory.slice(-MESSAGE_LIMIT);
    }

    // Tüm istemcilere gönder
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'update',
          messages: messageHistory
        }));
      }
    });
  } catch (error) {
    console.error('Mesaj işlenirken hata oluştu:', error);
  }
};

wss.on('connection', (ws) => {
  console.log('Yeni kullanıcı bağlandı');

  // Mevcut mesaj geçmişini yeni bağlanan kullanıcıya gönder
  ws.send(JSON.stringify({
    type: 'update',
    messages: messageHistory
  }));

  ws.on('message', (data) => {
    try {
      broadcast(data, ws);
    } catch (error) {
      console.error('Mesaj işlenirken hata oluştu:', error);
    }
  });

  ws.on('close', () => {
    console.log('Kullanıcı bağlantısı kesildi');
  });
});

console.log(`WebSocket sunucusu ${PORT} portunda çalışıyor`);
