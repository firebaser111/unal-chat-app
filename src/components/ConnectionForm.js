import React, { useState } from 'react';
import styles from '../styles/ConnectionForm.module.css';
import config from '../config';

function ConnectionForm({ onConnect }) {
  const [serverUrl] = useState(config.websocketUrl);
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username) {
      onConnect(serverUrl, username);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Sohbete Katıl</h2>
      <input
        type="text"
        placeholder="Kullanıcı adınız"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button type="submit">Bağlan</button>
    </form>
  );
}

export default ConnectionForm;