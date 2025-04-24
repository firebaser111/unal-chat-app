import React from 'react';
import styles from '../styles/UserList.module.css';

const UserList = ({ users }) => {
  return (
    <div className={styles.userList}>
      <div className={styles.header}>
        <h2>People</h2>
      </div>
      <div className={styles.users}>
        {users.map(user => (
          <div key={user} className={styles.userItem}>
            <div className={styles.userAvatar}></div>
            <span className={styles.userName}>{user}</span>
            <span className={styles.userStatus}>●</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
