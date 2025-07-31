// src/pages/admin/SkillsPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Table,
  Button, Modal, Form, Spinner, Alert, Pagination
} from 'react-bootstrap';
import api from '../../utils/api';

const PAGE_SIZE = 10;

export default function SkillsPage() {
  const [skills, setSkills]             = useState([]);
  const [categories, setCategories]     = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [page, setPage]                 = useState(1);
  const [pages, setPages]               = useState(1);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');

  // modal state
  const [showEditModal, setShowEditModal]   = useState(false);
  const [editingSkill, setEditingSkill]     = useState(null);
  const [formData, setFormData]             = useState({ name: '', category: '' });
  const [customCategory, setCustomCategory] = useState('');
  const [saving, setSaving]                 = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSkillId, setDeleteSkillId]     = useState(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage]     = useState('');

  // fetch categories (could be fetched from server)
  useEffect(() => {
    setCategories(['Coding','Video','Design','Research','Tutoring']);
  }, []);

  // fetch skills list
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/api/admin/skills', {
          params: { page, limit: PAGE_SIZE, category: filterCategory }
        });
        setSkills(data.data);
        setPages(data.pagination.pages);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load skills');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [page, filterCategory]);

  // open Add/Edit modal
  const openAdd = () => {
    setEditingSkill(null);
    setFormData({ name: '', category: '' });
    setCustomCategory('');
    setShowEditModal(true);
  };
  const openEdit = skill => {
    setEditingSkill(skill);
    setFormData({ name: skill.name, category: categories.includes(skill.category) ? skill.category : '__custom__' });
    setCustomCategory(categories.includes(skill.category) ? '' : skill.category);
    setShowEditModal(true);
  };
  const closeEditModal = () => {
    setShowEditModal(false);
    setError('');
  };

  // handle Save
  const handleSave = async () => {
    setSaving(true);
    const payload = {
      name: formData.name.trim(),
      category: formData.category === '__custom__' 
        ? customCategory.trim() 
        : formData.category
    };

    try {
      // Create: add new custom category to list
      if (!categories.includes(payload.category)) {
        setCategories(prev => [...prev, payload.category]);
      }

      if (editingSkill) {
        await api.put(`/api/admin/skills/${editingSkill.id}`, payload);
        setSuccessMessage('Skill updated successfully!');
      } else {
        await api.post('/api/admin/skills', payload);
        setSuccessMessage('Skill added successfully!');
      }
      setShowSuccessModal(true);
      closeEditModal();
      setPage(1);
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  // open Delete confirmation
  const confirmDelete = id => {
    setDeleteSkillId(id);
    setShowDeleteModal(true);
  };
  const handleDelete = async () => {
    try {
      await api.delete(`/api/admin/skills/${deleteSkillId}`);
      setShowDeleteModal(false);
      setSuccessMessage('Skill deleted successfully!');
      setShowSuccessModal(true);
      setPage(1);
    } catch {
      setShowDeleteModal(false);
      setError('Failed to delete skill');
    }
  };

  return (
    <Container fluid>
      <Row className="align-items-center mb-3">
        <Col><h2 className="text-success">Manage Skills</h2></Col>
        <Col className="text-end">
          <Button variant="success" onClick={openAdd}>+ Add Skill</Button>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col sm={3}>
          <Form.Select
            value={filterCategory}
            onChange={e => { setPage(1); setFilterCategory(e.target.value); }}
            className="border-success"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {loading
        ? <div className="text-center"><Spinner animation="border" variant="success" /></div>
        : error
          ? <Alert variant="danger">{error}</Alert>
          : <>
            <Table bordered hover responsive>
              <thead className="table-success">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {skills.map(s => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.name}</td>
                    <td>{s.category}</td>
                    <td>
                      <Button size="sm" variant="success" onClick={() => openEdit(s)}>Edit</Button>{' '}
                      <Button size="sm" variant="danger" onClick={() => confirmDelete(s.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Pagination>
              <Pagination.First onClick={() => setPage(1)} disabled={page === 1} />
              <Pagination.Prev onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} />
              {[...Array(pages)].map((_, i) => (
                <Pagination.Item
                  key={i+1}
                  active={i+1 === page}
                  onClick={() => setPage(i+1)}
                  className={i+1 === page ? 'bg-success text-white' : ''}
                >
                  {i+1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => setPage(p => Math.min(p+1, pages))} disabled={page === pages} />
              <Pagination.Last onClick={() => setPage(pages)} disabled={page === pages} />
            </Pagination>
          </>
      }

      {/* Add/Edit Modal */}
      <Modal show={showEditModal} onHide={closeEditModal}>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>{editingSkill ? 'Edit Skill' : 'Add Skill'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={formData.name}
                onChange={e => setFormData(fd => ({ ...fd, name: e.target.value }))}
                placeholder="e.g. JavaScript"
                className="border-success"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={formData.category}
                onChange={e => setFormData(fd => ({ ...fd, category: e.target.value }))}
                className="border-success mb-2"
              >
                <option value="">Select category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                <option value="__custom__">+ Add custom category…</option>
              </Form.Select>
              {formData.category === '__custom__' && (
                <Form.Control
                  value={customCategory}
                  onChange={e => setCustomCategory(e.target.value)}
                  placeholder="Enter new category"
                  className="border-success mt-1"
                />
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEditModal} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleSave}
            disabled={
              saving ||
              !formData.name.trim() ||
              (!formData.category) ||
              (formData.category === '__custom__' && !customCategory.trim())
            }
          >
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this skill?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>{successMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setShowSuccessModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
