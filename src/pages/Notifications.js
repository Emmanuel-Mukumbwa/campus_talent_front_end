// File: src/pages/Notifications.jsx

import React, { useState, useEffect } from 'react';
import { Container, ListGroup, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function Notifications() {
  const [notifs, setNotifs]   = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate              = useNavigate();

  // 1) Load notifications
  const fetchNotifs = async () => {
    try {
      const { data } = await api.get('/api/notifications');
      setNotifs(data);
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  // 2) Mark one as read
  const markRead = async id => {
    try {
      await api.patch(`/api/notifications/${id}/read`);
      setNotifs(ns => ns.map(n => n.id === id ? { ...n, is_read: 1 } : n));
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  // 3) Delete one
  const deleteOne = async id => {
    if (!window.confirm('Delete this notification?')) return;
    try {
      await api.delete(`/api/notifications/${id}`);
      setNotifs(ns => ns.filter(n => n.id !== id));
    } catch (err) {
      console.error('Failed to delete notification', err);
    }
  };

  // 4) Mark all as read
  const markAll = async () => {
    try {
      await Promise.all(
        notifs
          .filter(n => !n.is_read)
          .map(n => api.patch(`/api/notifications/${n.id}/read`))
      );
      setNotifs(ns => ns.map(n => ({ ...n, is_read: 1 })));
    } catch (err) {
      console.error('Failed to mark all read', err);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Your Notifications</h3>
        <div>
          <Button
            variant="outline-success"
            size="sm"
            className="me-2"
            onClick={markAll}
          >
            Mark all read
          </Button>
          <Button variant="outline-danger" size="sm" onClick={() => navigate(-1)}>
            ← Back
          </Button>
        </div>
      </div>

      {notifs.length === 0 ? (
        <p className="text-muted">No notifications.</p>
      ) : (
        <ListGroup as="ul">
          {notifs.map(n => {
            // Safe parse of data payload
            let payload;
            if (typeof n.data === 'string') {
              try {
                payload = JSON.parse(n.data);
              } catch {
                payload = { text: n.data };
              }
            } else {
              payload = n.data || {};
            }

            return (
              <ListGroup.Item
                as="li"
                key={n.id}
                className="d-flex justify-content-between align-items-start"
              >
                <div>
                  <div className={n.is_read ? '' : 'fw-bold'}>
                    {payload.text}
                  </div>
                  <small className="text-muted">
                    {new Date(n.created_at).toLocaleString()}
                  </small>
                </div>
                <div className="btn-group btn-group-sm">
                  {!n.is_read && (
                    <Button variant="success" onClick={() => markRead(n.id)}>
                      Mark read
                    </Button>
                  )}
                  {/*<Button variant="danger" onClick={() => deleteOne(n.id)}>
                    Delete
                  </Button>*/}
                </div>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      )}
    </Container>
  );
}
