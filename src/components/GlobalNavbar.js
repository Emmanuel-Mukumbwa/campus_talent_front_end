// File: src/components/GlobalNavbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaUsers,
  FaBriefcase,
  FaEnvelope,
  FaBell,
  FaBars   // new import
} from 'react-icons/fa';
import {
  Badge,
  Modal,
  Button as BsButton
} from 'react-bootstrap';
import './navbar.css';
import api from '../utils/api';

export default function GlobalNavbar() {
  const [avatarSrc, setAvatarSrc]           = useState('/default-avatar.png');
  const [msgUnreadCount, setMsgUnreadCount] = useState(0);
  const [notifs, setNotifs]                 = useState([]);
  const [showNotif, setShowNotif]           = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const notifRef = useRef();
  const navigate = useNavigate();

  // Helper to check if user is logged in
  const isLoggedIn = () => !!localStorage.getItem('authToken');

  // Load avatar only if logged in
  useEffect(() => {
    if (!isLoggedIn()) return;

    api.get('/api/profile')
      .then(({ data }) => {
        let src = '/default-avatar.png';
        if (data.avatar_url) {
          if (/^https?:\/\//.test(data.avatar_url)) src = data.avatar_url;
          else {
            const base = api.defaults.baseURL?.replace(/\/+$/, '') || window.location.origin;
            src = `${base}${data.avatar_url}`;
          }
        }
        setAvatarSrc(src);
      })
      .catch(() => {});
  }, []);

  // Poll unread message count (only when logged in)
  useEffect(() => {
    if (!isLoggedIn()) return;

    let cancelled = false;
    const fetchUnread = async () => {
      try {
        const { data: convos } = await api.get('/api/messages/conversations');
        if (cancelled) return;
        const total = convos.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
        setMsgUnreadCount(total);
      } catch (err) {
        console.error('Failed to fetch message counts', err);
      }
    };
    fetchUnread();
    const iv = setInterval(fetchUnread, 30_000);
    return () => { cancelled = true; clearInterval(iv); };
  }, []);

  // Poll in-app notifications (only when logged in)
  useEffect(() => {
    if (!isLoggedIn()) return;

    let cancelled = false;
    const fetchNotifs = async () => {
      try {
        const { data } = await api.get('/api/notifications');
        if (cancelled) return;
        setNotifs(data);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };
    fetchNotifs();
    const iv = setInterval(fetchNotifs, 30_000);
    return () => { cancelled = true; clearInterval(iv); };
  }, []);

  // Close notif dropdown on outside click
  useEffect(() => {
    const handler = e => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    delete api.defaults.headers.common['Authorization'];
    setShowLogoutModal(false);
    navigate('/login');
  };

  const navItems = [
    { label: 'Home', to: '/',        Icon: FaHome },
    { label: 'Gigs', to: '/jobs',    Icon: FaBriefcase },
    { label: 'Network', to: '/mynetwork', Icon: FaUsers },
    { label: 'Messaging', to: '/messages',  Icon: FaEnvelope },
  ];

  const unread = notifs.filter(n => !n.is_read);
  const unreadCount = unread.length;

  return (
    <>
      <nav className="navbar navbar-expand-lg glass-nav fixed-top shadow-sm">
        <div className="container">
          <NavLink className="navbar-brand logo" to="/">CampusTalent</NavLink>

          {/* spacer if you ever add a search in future */}
          <div className="mx-auto" style={{ width: 300 }} />

          {/* toggler now pushed right and uses FaBars */}
          <button
            className="navbar-toggler custom-toggler ms-auto"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-label="Toggle navigation"
          >
            <FaBars className="fa-bars-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav mb-2 mb-lg-0 align-items-center">
              {navItems.map(({ label, to, Icon }) => (
                <li className="nav-item px-2" key={label}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `nav-link d-flex align-items-center${isActive ? ' active-link' : ''}`
                    }
                  >
                    <Icon className="me-1 nav-icon" />
                    <span className="nav-label">{label}</span>
                    {label === 'Messaging' && msgUnreadCount > 0 && (
                      <Badge bg="danger" pill className="notif-badge">
                        {msgUnreadCount}
                      </Badge>
                    )}
                  </NavLink>
                </li>
              ))}

              {/* in-app notifications (only shown if logged in) */}
              {isLoggedIn() && (
                <li className="nav-item dropdown px-2" ref={notifRef}>
                  <span
                    className="nav-link position-relative d-flex align-items-center bell-trigger"
                    onClick={() => setShowNotif(v => !v)}
                  >
                    <FaBell className="nav-icon" />
                    {unreadCount > 0 && (
                      <Badge bg="danger" pill className="notif-badge">
                        {unreadCount}
                      </Badge>
                    )}
                  </span>

                  {showNotif && (
                    <div className="notif-dropdown shadow-sm">
                      <h6 className="dropdown-header">Notifications</h6>

                      {unreadCount === 0 ? (
                        <div className="dropdown-item text-muted">No new notifications</div>
                      ) : (
                        unread.map(n => {
                          let payload;
                          if (typeof n.data === 'string') {
                            try { payload = JSON.parse(n.data); }
                            catch { payload = { text: n.data }; }
                          } else {
                            payload = n.data || {};
                          }

                          return (
                            <div
                              key={n.id}
                              className="dropdown-item notif-item fw-bold"
                              onClick={async () => {
                                await api.patch(`/api/notifications/${n.id}/read`);
                                setNotifs(ns =>
                                  ns.map(x =>
                                    x.id === n.id ? { ...x, is_read: 1 } : x
                                  )
                                );
                                navigate('/notifications');
                              }}
                            >
                              {payload.text}
                              <br/>
                              <small className="text-muted">
                                {new Date(n.created_at).toLocaleString()}
                              </small>
                            </div>
                          );
                        })
                      )}

                      <div className="dropdown-divider" />
                      <NavLink to="/notifications" className="dropdown-item text-center">
                        See all
                      </NavLink>
                    </div>
                  )}
                </li>
              )}

              {/* user avatar/menu */}
              <li className="nav-item dropdown ps-2">
                <span
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  id="meDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  <img
                    src={avatarSrc}
                    alt="avatar"
                    className="rounded-circle"
                    width={30}
                    height={30}
                  />
                </span>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="meDropdown">
                  {isLoggedIn() ? (
                    <>
                      <li><NavLink className="dropdown-item" to="/myprofile">My Profile</NavLink></li>
                      <li><NavLink className="dropdown-item" to="/fees">Fees & Pricing</NavLink></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><button className="dropdown-item" onClick={() => setShowLogoutModal(true)}>Sign Out</button></li>
                    </>
                  ) : (
                    <li><button className="dropdown-item" onClick={() => navigate('/login')}>Sign in</button></li>
                  )}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Sign Out</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to sign out?</Modal.Body>
        <Modal.Footer>
          <BsButton variant="secondary" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </BsButton>
          <BsButton variant="danger" onClick={handleLogout}>
            Sign Out
          </BsButton>
        </Modal.Footer>
      </Modal>
    </>
  );
}