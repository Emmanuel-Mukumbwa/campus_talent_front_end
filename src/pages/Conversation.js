// File: src/pages/Conversation.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Form, Button, Spinner } from 'react-bootstrap';
import api from '../utils/api';
import './Conversation.css';

export default function Conversation() {
  const { otherId } = useParams();
  const [msgs, setMsgs]       = useState([]);
  const [text, setText]       = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef             = useRef();

  // Fetch & poll
  useEffect(() => {
    let cancelled = false;

    const fetchMessages = async () => {
      try {
        const { data } = await api.get(`/api/messages/${otherId}`);
        if (!cancelled) setMsgs(data);
      } catch (err) {
        console.error('Error fetching messages', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [otherId]);

  // Auto‑scroll
  useEffect(() => {
    const container = document.querySelector('.chat-window');
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [msgs]);

  // Send
  const handleSend = async e => {
    e.preventDefault();
    const msg = text.trim();
    if (!msg) return;

    const temp = {
      id: `temp-${Date.now()}`,
      sender_id: Number(localStorage.getItem('userId')),
      recipient_id: Number(otherId),
      message_text: msg,
      sent_at: new Date().toISOString(),
      read_at: null
    };
    setMsgs(prev => [...prev, temp]);
    setText('');

    try {
      await api.post('/api/messages', { to: otherId, message: msg });
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  return (
    <Container className="conversation-container my-4">
      <div className="d-flex align-items-center mb-3">
        <Link to="/messages" className="me-3 text-decoration-none">← Back</Link>
        <h4 className="mb-0">Chat</h4>
      </div>

      <div className="chat-window mb-3 d-flex flex-column">
        {msgs.map(m => {
          const isMe = m.sender_id === Number(localStorage.getItem('userId'));
          return (
            <div
              key={m.id}
              className={`d-flex mb-2 ${isMe ? 'justify-content-end' : 'justify-content-start'}`}
            >
              <div className={`chat-bubble ${isMe ? 'me' : 'them'}`}>
                {m.message_text}
                <div className="chat-meta">
                  <small className="me-2">
                    {new Date(m.sent_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </small>
                  {isMe && (
                    <span className={`ticks ${m.read_at ? 'read' : 'sent'}`}>
                      ✓✓
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <Form onSubmit={handleSend} className="send-area d-flex">
        <Form.Control
          placeholder="Type a message…"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <Button type="submit" className="ms-2">
          Send
        </Button>
      </Form>
    </Container>
  );
}
