// File: src/pages/admin/ManageSubscriptions.jsx

import React, { useEffect, useState } from 'react';
import {
  Tabs,
  Tab,
  Table,
  Spinner,
  Alert,
  Button,
  Modal,
  Form
} from 'react-bootstrap';
import api from '../../utils/api';

export default function ManageSubscriptions() {
  const [key, setKey] = useState('subscriptions');

  // --- Subscriptions state ---
  const [subs, setSubs]               = useState([]);
  const [subsLoading, setSubsLoading] = useState(true);
  const [subsError, setSubsError]     = useState('');

  // --- Plans state ---
  const [plans, setPlans]             = useState([]);
  const [planLoading, setPlanLoading] = useState(true);
  const [planError, setPlanError]     = useState('');

  // Confirm modal for sub actions
  const [confirmSub, setConfirmSub]       = useState({ show: false, id: null, action: '', label: '' });
  const [subActionLoading, setSubActionLoading] = useState(false);
  const [subActionError, setSubActionError]     = useState('');

  // Modals & form for plan CRUD
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlan, setEditingPlan]     = useState(null);
  const [planForm, setPlanForm]           = useState({ key: '', label: '', price: 0, max_posts: 1 });
  const [planFormError, setPlanFormError] = useState('');
  const [planToDelete, setPlanToDelete]   = useState(null);

  // --- Load data once ---
  useEffect(() => {
    api.get('/api/admin/subscriptions')
      .then(r => setSubs(r.data))
      .catch(() => setSubsError('Failed to load subscriptions'))
      .finally(() => setSubsLoading(false));

    api.get('/api/admin/plans')
      .then(r => setPlans(r.data))
      .catch(() => setPlanError('Failed to load plans'))
      .finally(() => setPlanLoading(false));
  }, []);

  // --- Subscription actions ---
  const openConfirmSub = (id, action) => {
    setSubActionError('');
    setConfirmSub({
      show:   true,
      id,
      action,
      label: action === 'cancel' ? 'Cancel' : 'Reactivate'
    });
  };
  const handleConfirmSub = async () => {
    const { id, action } = confirmSub;
    setSubActionLoading(true);
    try {
      await api.post(`/api/admin/subscriptions/${id}/${action}`);
      const { data } = await api.get('/api/admin/subscriptions');
      setSubs(data);
      setConfirmSub({ ...confirmSub, show: false });
    } catch {
      setSubActionError('Operation failed — please try again.');
    } finally {
      setSubActionLoading(false);
    }
  };

  // --- Plan CRUD handlers ---
  const openPlanModal = plan => {
    if (plan) {
      setEditingPlan(plan);
      setPlanForm({
        key:       plan.key,
        label:     plan.label,
        price:     plan.price,
        max_posts: plan.max_posts
      });
    } else {
      setEditingPlan(null);
      setPlanForm({ key: '', label: '', price: 0, max_posts: 1 });
    }
    setPlanFormError('');
    setShowPlanModal(true);
  };
  const handlePlanSubmit = async () => {
    const { key, label, price, max_posts } = planForm;
    if ((!editingPlan && !key.trim()) || !label.trim() || price < 0 || max_posts < -1) {
      setPlanFormError('Please fill in all fields correctly.');
      return;
    }
    try {
      if (editingPlan) {
        await api.put(`/api/admin/plans/${editingPlan.id}`, { label, price, max_posts });
      } else {
        await api.post(`/api/admin/plans`, { key, label, price, max_posts });
      }
      const { data } = await api.get('/api/admin/plans');
      setPlans(data);
      setShowPlanModal(false);
    } catch (err) {
      setPlanFormError(err.response?.data?.message || 'Error saving plan');
    }
  };
  const handlePlanDelete = async () => {
    try {
      await api.delete(`/api/admin/plans/${planToDelete.id}`);
      setPlans(plans.filter(p => p.id !== planToDelete.id));
      setPlanToDelete(null);
    } catch {
      alert('Failed to delete plan.');
    }
  };

  return (
    <>
      <Tabs activeKey={key} onSelect={k => setKey(k)} className="mb-4">
        {/* ---------- Subscriptions Tab ---------- */}
        <Tab eventKey="subscriptions" title="Subscriptions">
          {subsLoading
            ? <Spinner />
            : subsError
              ? <Alert variant="danger">{subsError}</Alert>
              : (
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Recruiter</th>
                      <th>Plan</th>
                      <th>Status</th>
                      <th>Starts</th>
                      <th>Ends</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subs.map(s => (
                      <tr key={s.id}>
                        <td>{s.id}</td>
                        <td>{s.recruiterName} (#{s.recruiter_id})</td>
                        <td>{s.plan}</td>
                        <td>{s.status}</td>
                        <td>{new Date(s.current_period_start).toLocaleDateString()}</td>
                        <td>{new Date(s.current_period_end).toLocaleDateString()}</td>
                        <td>{new Date(s.created_at).toLocaleString()}</td>
                        <td className="d-flex gap-2">
                          {s.status === 'active' ? (
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => openConfirmSub(s.id, 'cancel')}
                            >
                              Cancel
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => openConfirmSub(s.id, 'reactivate')}
                            >
                              Reactivate
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )
          }
        </Tab>

        {/* ---------- Plans Tab ---------- */}
        <Tab eventKey="plans" title="Plans">
          <div className="d-flex justify-content-between mb-3">
            <h4>Manage Plans</h4>
            <Button onClick={() => openPlanModal(null)}>+ Create Plan</Button>
          </div>

          {planLoading
            ? <Spinner />
            : planError
              ? <Alert variant="danger">{planError}</Alert>
              : (
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Key</th>
                      <th>Label</th>
                      <th>Price (MK)</th>
                      <th>Max Posts</th>
                      <th>Created</th>
                      <th>Updated</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map(p => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.key}</td>
                        <td>{p.label}</td>
                        <td>{p.price.toLocaleString()}</td>
                        <td>{p.max_posts < 0 ? '∞' : p.max_posts}</td>
                        <td>{new Date(p.created_at).toLocaleDateString()}</td>
                        <td>{new Date(p.updated_at).toLocaleDateString()}</td>
                        <td>
                          <Button size="sm" onClick={() => openPlanModal(p)}>Edit</Button>{' '}
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => setPlanToDelete(p)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )
          }
        </Tab>
      </Tabs>

      {/* ---------- Subscription Confirmation Modal ---------- */}
      <Modal
        show={confirmSub.show}
        onHide={() => setConfirmSub({ ...confirmSub, show: false })}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {confirmSub.label} Subscription
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {subActionError && <Alert variant="danger">{subActionError}</Alert>}
          Are you sure you want to <strong>{confirmSub.label}</strong> subscription #{confirmSub.id}?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setConfirmSub({ ...confirmSub, show: false })}
            disabled={subActionLoading}
          >
            Cancel
          </Button>
          <Button
            variant={confirmSub.action === 'cancel' ? 'danger' : 'success'}
            onClick={handleConfirmSub}
            disabled={subActionLoading}
          >
            {subActionLoading
              ? <Spinner animation="border" size="sm" />
              : confirmSub.label}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ---------- Plan Create/Edit Modal ---------- */}
      <Modal show={showPlanModal} onHide={() => setShowPlanModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingPlan ? 'Edit Plan' : 'New Plan'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {planFormError && <Alert variant="danger">{planFormError}</Alert>}
          <Form.Group className="mb-2">
            <Form.Label>Key {editingPlan && '(immutable)'}</Form.Label>
            <Form.Control
              type="text"
              value={planForm.key}
              disabled={!!editingPlan}
              onChange={e => setPlanForm(f => ({ ...f, key: e.target.value }))}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Label</Form.Label>
            <Form.Control
              type="text"
              value={planForm.label}
              onChange={e => setPlanForm(f => ({ ...f, label: e.target.value }))}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Price (MK)</Form.Label>
            <Form.Control
              type="number"
              value={planForm.price}
              onChange={e => setPlanForm(f => ({ ...f, price: +e.target.value }))}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Max Posts (−1 = unlimited)</Form.Label>
            <Form.Control
              type="number"
              value={planForm.max_posts}
              onChange={e => setPlanForm(f => ({ ...f, max_posts: +e.target.value }))}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          {editingPlan && (
            <Button
              variant="danger"
              onClick={() => setPlanToDelete(editingPlan)}
            >
              Delete Plan
            </Button>
          )}
          <div>
            <Button variant="secondary" onClick={() => setShowPlanModal(false)}>
              Cancel
            </Button>
            <Button variant="success" onClick={handlePlanSubmit} className="ms-2">
              {editingPlan ? 'Save Changes' : 'Create Plan'}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* ---------- Plan Delete Confirmation Modal ---------- */}
      <Modal show={!!planToDelete} onHide={() => setPlanToDelete(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Plan?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to permanently delete the “{planToDelete?.label}” plan?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setPlanToDelete(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handlePlanDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
