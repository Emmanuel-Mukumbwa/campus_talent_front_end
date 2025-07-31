import React from 'react';
//import './NotificationsPanel.css';

export default function NotificationsPanel({ notifications }) {
  return (
    <div className="notifications-panel">
      <h6>Notifications</h6>
      <ul className="list-unstyled mb-0">
        {notifications.map((n, i) => (
          <li key={i} className="notification-item mb-2">
            {n}
          </li>
        ))}
      </ul>
    </div>
  );
}
