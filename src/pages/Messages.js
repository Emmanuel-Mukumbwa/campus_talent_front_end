// File: src/pages/Messages.jsx

import React, { useState, useEffect } from 'react';
import { ListGroup, Badge, Spinner, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './Messages.css';

export default function Messages() {
  const [convos, setConvos]   = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate              = useNavigate();

  useEffect(() => {
    api.get('/api/messages/conversations')
      .then(res => setConvos(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  return (
    <div className="container-myconvos my-4">
      <h3 className="convos-header mb-3">Your Conversations</h3>

      {convos.length === 0 ? (
        <p className="text-muted">
          No conversations yet. Start one by messaging someone!
        </p>
      ) : (
        <ListGroup as="ul" className="p-0">
          {convos.map(c => (
            <ListGroup.Item
              as="li"
              key={c.otherId}
              action
              onClick={() => navigate(`/messages/${c.otherId}`)}
              className="d-flex align-items-center convo-item"
            >
              <Image
                src={c.otherAvatar || '/default-avatar.png'}
                roundedCircle
                width={48}
                height={48}
                className="me-3 convo-avatar"
              />

              <div className="d-flex flex-column convo-content">
                <span className="other-name">{c.otherName}</span>
                <span className="last-text">{c.last_text}</span>
              </div>

              <div className="convo-meta ms-3">
                <div>{new Date(c.last_at).toLocaleDateString()}</div>
                {c.unreadCount > 0 && (
                  <Badge bg="danger" pill>
                    {c.unreadCount}
                  </Badge>
                )}
                <div>
                  <small>
                    Last seen {new Date(c.otherLastSeen).toLocaleTimeString()}
                  </small>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
}
