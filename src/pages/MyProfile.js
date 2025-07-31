// File: src/pages/MyProfile.jsx

import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Table,
  Badge,
  Form,
  Button
} from 'react-bootstrap';
import {
  EnvelopeFill,
  TelephoneFill,
  CheckCircleFill,
  Award,
  Briefcase,
  Star
} from 'react-bootstrap-icons';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';

import ProfileHeader from '../components/myprofile/ProfileHeader';
import ProfileForm   from '../components/myprofile/ProfileForm';

export default function MyProfile() {
  const navigate     = useNavigate();
  const { userId: paramId } = useParams();
  const userId       = paramId || 'me';
  const isOwnProfile = userId === 'me';

  const [user,    setUser]    = useState(null);
  const [form,    setForm]    = useState({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // avatar preview
  const [localPreview, setLocalPreview] = useState(null);

  // related data
  const [skills,  setSkills]  = useState([]);
  const [gigs,    setGigs]    = useState([]);
  const [reviews, setReviews] = useState([]);

  // 1) Load profile
  useEffect(() => {
    (async () => {
      try {
        const url = userId === 'me'
          ? '/api/profile'
          : `/api/profile/${userId}`;
        const { data } = await api.get(url);
        setUser(data);
        setForm(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  // 2) Load extras once user arrives
  useEffect(() => {
    if (!user) return;
    if (user.role === 'student') {
      api.get(`/api/profile/${user.id}/skills`)
         .then(r => setSkills(r.data))
         .catch(() => {});
    }
    if (user.role === 'recruiter') {
      api.get(`/api/profile/${user.id}/gigs`)
         .then(r => setGigs(r.data))
         .catch(() => {});
    }
    api.get(`/api/profile/${user.id}/reviews`)
       .then(r => setReviews(r.data))
       .catch(() => {});
  }, [user]);

  // Toggle edit mode
  const toggleEdit = () => {
    setEditing(!editing);
    setForm(user);
    setLocalPreview(null);
  };

  // Handle form changes
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // Save profile updates
  const handleSave = async () => {
    try {
      const { data } = await api.put('/api/profile', form);
      setUser(u => ({ ...u, ...data }));
      setForm(f => ({ ...f, ...data }));
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save profile');
    }
  };

  // Avatar upload
  const handleAvatarChange = async file => {
    const previewURL = URL.createObjectURL(file);
    setLocalPreview(previewURL);

    const fd = new FormData();
    fd.append('avatar', file);
    try {
      const { data } = await api.post(
        '/api/profile/avatar',
        fd,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setUser(u => ({ ...u, avatar_url: data.avatar_url }));
      setForm(f => ({ ...f, avatar_url: data.avatar_url }));
    } catch (err) {
      console.error('Avatar upload error', err);
      alert(err.response?.data?.message || 'Failed to upload avatar');
    } finally {
      URL.revokeObjectURL(previewURL);
      setLocalPreview(null);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="success" />
      </Container>
    );
  }
  if (!user) {
    return (
      <Container className="py-5 text-center">
        User not found
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Header w/ avatar upload */}
      <ProfileHeader
        avatarUrl={user.avatar_url}
        editing={editing && isOwnProfile}
        localPreview={localPreview}
        onAvatarChange={handleAvatarChange}
      />

      {/* Name / role badges / actions */}
      <Row className="align-items-center mb-4">
        <Col>
          {editing ? (
            <Form.Control
              name="name"
              value={form.name}
              onChange={handleChange}
              size="lg"
            />
          ) : (
            <h3 className="mb-1">{user.name}</h3>
          )}
          <div className="text-muted">
            {user.role === 'student'
              ? `${user.program}, ${user.university} (${user.year})`
              : user.company_name}
          </div>
          <div className="mt-2">
            {user.email_verified && (
              <Badge bg="success" className="me-1">
                <CheckCircleFill /> Email Verified
              </Badge>
            )}

            {/* Only show for YOUR OWN recruiter profile */}
            {isOwnProfile && user.role === 'recruiter' && (
              <>
                {user.is_verified ? (
                  <Badge bg="success" className="me-1">
                    <CheckCircleFill /> Recruiter Verified
                  </Badge>
                ) : (
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={() => navigate('/recruiterverification')}
                    className="me-1"
                  >
                    <Award /> Verify Account
                  </Button>
                )}

                <Button
                  variant="success"
                  size="sm"
                  onClick={() => navigate('/subscriptions')}
                >
                  <Briefcase className="me-1" /> Subscription Plans
                </Button>
              </>
            )}
          </div>
        </Col>

        <Col xs="auto" className="text-end">
          {isOwnProfile ? (
            editing ? (
              <Button variant="success" onClick={handleSave}>
                Save Profile
              </Button>
            ) : (
              <Button variant="outline-success" onClick={toggleEdit}>
                Edit Profile
              </Button>
            )
          ) : (
            <Button
              variant="success"
              onClick={() => navigate(`/messages/${user.id}`)}
            >
              <EnvelopeFill className="me-1" /> Message
            </Button>
          )}
        </Col>
      </Row>

      {/* Profile form (editable) */}
      {isOwnProfile && (
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <ProfileForm
              user={user}
              form={form}
              editing={editing}
              onChange={handleChange}
              onSave={handleSave}
            />
          </Card.Body>
        </Card>
      )}

      {/* Contact & extra info */}
      <Row className="g-4 mb-4">
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Header>
              <TelephoneFill className="me-2 text-success" />
              Contact
            </Card.Header>
            <Card.Body>
              <p>
                <EnvelopeFill className="me-2 text-success" />
                {user.email}
              </p>
              <p>
                <TelephoneFill className="me-2 text-success" />
                {editing ? (
                  <Form.Control
                    name="phone"
                    value={form.phone || ''}
                    onChange={handleChange}
                  />
                ) : (
                  user.phone || '—'
                )}
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Header>
              <Briefcase className="me-2 text-success" />
              Extras
            </Card.Header>
            <Card.Body>
              <Table borderless size="sm">
                <tbody>
                  {user.availability && (
                    <tr>
                      <th>Availability</th>
                      <td>{user.availability}</td>
                    </tr>
                  )}
                  {user.payment_pref && (
                    <tr>
                      <th>Payment Pref.</th>
                      <td>{user.payment_pref}</td>
                    </tr>
                  )}
                  {user.department && (
                    <tr>
                      <th>Department</th>
                      <td>{user.department}</td>
                    </tr>
                  )}
                  {user.last_active && (
                    <tr>
                      <th>Last Active</th>
                      <td>{new Date(user.last_active).toLocaleString()}</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Student skills & endorsements */}
      {user.role === 'student' && (
        <Card className="mb-4 shadow-sm">
          <Card.Header>
            <Award className="me-2 text-success" />
            Skills & Endorsements
          </Card.Header>
          <Card.Body>
            {skills.map(s => (
              <Badge bg="success" className="me-1 mb-1" key={s.id}>
                {s.name} ({s.endorsements})
              </Badge>
            ))}
          </Card.Body>
        </Card>
      )}

      {/* Recruiter’s own posted gigs */}
      {user.role === 'recruiter' && (
        <Card className="mb-4 shadow-sm">
          <Card.Header>
            <Briefcase className="me-2 text-success" />
            Posted Gigs
          </Card.Header>
          <Card.Body>
            {gigs.length ? (
              <ul className="mb-0">
                {gigs.map(g => (
                  <li key={g.id}>{g.title}</li>
                ))}
              </ul>
            ) : (
              <p>No gigs posted yet.</p>
            )}
          </Card.Body>
        </Card>
      )}

      {/* Reviews */}
      <Card className="mb-4 shadow-sm">
        <Card.Header>
          <Star className="me-2 text-success" />
          Reviews
        </Card.Header>
        <Card.Body>
          {reviews.length ? (
            reviews.map(r => (
              <Card key={r.id} className="mb-2">
                <Card.Body>
                  <Card.Title>{r.reviewerName}</Card.Title>
                  <Card.Text>{r.comment}</Card.Text>
                  <small>Rating: {r.rating} / 5</small>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
