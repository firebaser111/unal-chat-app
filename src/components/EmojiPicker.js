import React, { useState } from 'react';
import styles from '../styles/EmojiPicker.module.css';

const EMOJI_CATEGORIES = {
  'Yüz İfadeleri': ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😋', '😎', '🤓', '🧐', '🤔', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '😮‍💨', '😤', '😠', '😡'],
  'El ve Vücut': ['👍', '👎', '👏', '🙌', '🤝', '🤲', '🤞', '✌️', '🤟', '🤘', '👌', '🤌', '🤏', '👈', '👉', '👆', '👇', '💪', '🦾', '🖐️', '✋', '🤚', '🖖', '👋', '🤙', '💅'],
  'Kalp ve Sevgi': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💔', '❤️‍🔥', '💘', '💝', '💖', '💗', '💓', '💞', '💕', '💌'],
  'Hayvanlar': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦅', '🦉', '🦆', '🐝', '🦋', '🐌'],
  'Yiyecek': ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🥨', '🥐', '🍞', '🧀', '🍖', '🍗', '🥩', '🥓', '🍔', '🍟', '🍕', '🌮', '🥪'],
  'Aktiviteler': ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🎱', '🎮', '🎲', '🧩', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🪗', '🎸', '🎺', '🎻'],
  'Seyahat': ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '✈️', '🚀', '🛸', '🚲', '⛵', '🚢', '🗺️', '🗽', '🗼', '🏰', '🏯', '🏠', '🏡', '⛪', '🕌'],
  'Objeler': ['💡', '📱', '💻', '⌨️', '🖥️', '🖨️', '📷', '🎥', '🔍', '🔑', '🔒', '🔨', '⚒️', '🛠️', '⚙️', '📚', '📖', '✏️', '📝', '✉️', '📧', '💰', '🎁', '🎈', '🎉']
};

const EmojiPicker = ({ onEmojiSelect }) => {
  const [activeCategory, setActiveCategory] = useState('Yüz İfadeleri');

  return (
    <div className={styles.emojiPicker}>
      <div className={styles.categories}>
        {Object.keys(EMOJI_CATEGORIES).map(category => (
          <button
            key={category}
            className={`${styles.categoryButton} ${activeCategory === category ? styles.active : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {EMOJI_CATEGORIES[category][0]}
          </button>
        ))}
      </div>
      <div className={styles.emojiList}>
        {EMOJI_CATEGORIES[activeCategory].map(emoji => (
          <button
            key={emoji}
            className={styles.emojiButton}
            onClick={() => onEmojiSelect(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;