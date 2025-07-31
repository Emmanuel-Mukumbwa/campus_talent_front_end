// File: src/components/verification/BusinessVerification.jsx

import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
  Spinner,
  Alert,
  InputGroup
} from 'react-bootstrap';
import {
  FileEarmark,
  CreditCard,
  CheckCircleFill
} from 'react-bootstrap-icons';
import api from '../../utils/api';

export default function BusinessVerification({ basicVerified }) {
  // Form state
  const [entityType, setEntityType] = useState('company');
  const [files, setFiles]           = useState({});
  const [onlineURL, setOnlineURL]   = useState('');
  const [loading, setLoading]       = useState(false);
  const [verified, setVerified]     = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [error, setError]           = useState('');

  // Preview modal
  const [previewSrc, setPreviewSrc]   = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Submission success modal
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Fetch business verification status once basicVerified
  useEffect(() => {
    if (!basicVerified) return;
    (async () => {
      try {
        const { data } = await api.get('/api/recruiters/verify/business/status');
        setStatusData(data);
        setEntityType(data.entity_type);
        setFiles({
          businessCert: data.letterhead_path,
          pinCert:      data.tin_number,
          idFront:      data.id_front_path,
          idBack:       data.id_back_path,
          selfie:       data.selfie_path,
        });
        setOnlineURL(data.domain || '');
        if (data.verification_status === 'fully_verified') {
          setVerified(true);
        }
      } catch {
        // no record yet
      }
    })();
  }, [basicVerified]);

  // Detect phases
  const isPending         = !statusData || statusData.verification_status === 'pending';
  const isInitialUpload   =
    statusData?.verification_status === 'basic_verified' &&
    !statusData.letterhead_path &&
    !statusData.tin_number &&
    !statusData.id_front_path &&
    !statusData.id_back_path &&
    !statusData.selfie_path;
  const isReuploadPhase   = statusData?.verification_status === 'basic_verified' && !isInitialUpload;

  // Handle file pick
  const handleFileChange = field => e =>
    setFiles(prev => ({ ...prev, [field]: e.target.files[0] }));

  // Preview helper
  const openPreview = src => {
    let previewUrl;
    if (typeof src === 'string') {
      const base = api.defaults.baseURL?.replace(/\/+$/, '') || 'http://localhost:5000';
      previewUrl = src.startsWith('http') ? src : `${base}${src}`;
    } else if (src instanceof File) {
      previewUrl = URL.createObjectURL(src);
    } else {
      return;
    }
    setPreviewSrc(previewUrl);
    setShowPreview(true);
  };
  const closePreview = () => {
    if (previewSrc?.startsWith('blob:')) URL.revokeObjectURL(previewSrc);
    setShowPreview(false);
  };

  // Submit all at once
  const handleSubmitAll = async () => {
    setError('');
    const required = entityType === 'company'
      ? ['businessCert','pinCert']
      : ['idFront','idBack','selfie'];
    if (required.some(k => !files[k]) || (entityType === 'company' && !onlineURL)) {
      setError('Please supply all required documents (and URL).');
      return;
    }

    const form = new FormData();
    form.append('entityType', entityType);
    if (entityType === 'company') {
      form.append('onlineURL', onlineURL);
      form.append('businessCert', files.businessCert);
      form.append('pinCert',      files.pinCert);
    } else {
      form.append('idFront', files.idFront);
      form.append('idBack',  files.idBack);
      form.append('selfie',  files.selfie);
    }

    setLoading(true);
    try {
      await api.post('/api/recruiters/verify/business', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const { data } = await api.get('/api/recruiters/verify/business/status');
      setStatusData(data);
      setShowSubmitModal(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  // Upload only one re-upload field
  const handleSingleUpload = field => async () => {
    if (!files[field]) return;
    setError('');
    const form = new FormData();
    form.append('entityType', entityType);
    form.append(field, files[field]);
    if (field === 'businessCert' && onlineURL) {
      form.append('onlineURL', onlineURL);
    }

    setLoading(true);
    try {
      await api.post('/api/recruiters/verify/business', form);
      const { data } = await api.get('/api/recruiters/verify/business/status');
      setStatusData(data);
      setShowSubmitModal(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  // Render links for already-uploaded files
  const renderPreviewLinks = () => {
    const isImage = url => /\.(jpe?g|png|gif|bmp|webp)$/i.test(url);

    if (entityType === 'company') {
      return (
        <>
          {['businessCert','pinCert'].map((field,i) => {
            const src = files[field];
            if (!src) return null;

            if (typeof src === 'string' && isImage(src)) {
              return (
                <Button
                  variant="link"
                  key={i}
                  onClick={()=>openPreview(src)}
                >
                  Preview {field==='businessCert'?'Certificate':'PIN'}
                </Button>
              );
            }

            const url = typeof src === 'string'
              ? (src.startsWith('http') ? src : `${api.defaults.baseURL}${src}`)
              : null;
            return url ? (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="d-block mb-2"
              >
                Open {field==='businessCert'?'Certificate':'PIN'}
              </a>
            ) : null;
          })}
          <hr/>
          {onlineURL && (
            <a href={onlineURL} target="_blank" rel="noopener noreferrer">
              {onlineURL}
            </a>
          )}
        </>
      );
    } else {
      return (
        <>
          {['idFront','idBack','selfie'].map(field => {
            const src = files[field];
            if (!src) return null;

            if (typeof src === 'string' && isImage(src)) {
              return (
                <Button
                  variant="link"
                  key={field}
                  onClick={()=>openPreview(src)}
                >
                  Preview {field==='selfie'?'Selfie':field==='idFront'?'Front':'Back'}
                </Button>
              );
            }

            const url = typeof src === 'string'
              ? (src.startsWith('http') ? src : `${api.defaults.baseURL}${src}`)
              : null;
            return url ? (
              <a
                key={field}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="d-block mb-2"
              >
                Open {field==='selfie'?'Selfie':field==='idFront'?'Front':'Back'}
              </a>
            ) : null;
          })}
        </>
      );
    }
  };

  // If basic email not yet verified
  if (!basicVerified) {
    return (
      <Alert variant="warning">
        Verify your email first to Proceed to business verification.
      </Alert>
    );
  }

  return (
    <>
      <h5>
        Business Verification{' '}
        {verified && <CheckCircleFill className="ms-2 text-success" />}
      </h5>

      {isReuploadPhase && (
        <Alert variant="info">
          You can only re‑upload files marked <strong>rejected</strong>.
        </Alert>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Entity selector */}
      <Form className="mb-4">
        <Form.Check
          inline label="Company"
          type="radio" name="entityType"
          checked={entityType==='company'}
          onChange={()=>setEntityType('company')}
          disabled={!(isPending||isInitialUpload)}
        />
        <Form.Check
          inline label="Freelancer"
          type="radio" name="entityType"
          checked={entityType==='freelancer'}
          onChange={()=>setEntityType('freelancer')}
          disabled={!(isPending||isInitialUpload)}
        />
      </Form>

      <Row>
        {/* Left: previews */}
        <Col md={4}>
          <Card body className="mb-3">
            {entityType==='company' ? (
              <>
                <h6><FileEarmark className="me-1" /> Business Registration Certificate</h6>
                {statusData?.letterhead_status==='rejected' && (
                  <span className="text-danger">(Rejected; re‑upload required)</span>
                )}
                {renderPreviewLinks()}
              </>
            ) : (
              <>
                <h6><CreditCard className="me-1" /> National ID</h6>
                {(statusData?.id_front_status==='rejected' || statusData?.id_back_status==='rejected') && (
                  <span className="text-danger">(Rejected; re‑upload required)</span>
                )}
                {renderPreviewLinks()}
              </>
            )}
          </Card>
        </Col>

        {/* Right: upload forms */}
        <Col md={8}>
          <Form>
            {/* Initial Upload */}
            {(isPending || isInitialUpload) && (
              <>
                {entityType==='company' ? (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Business Registration Certificate</Form.Label>
                      <Form.Control type="file" onChange={handleFileChange('businessCert')} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>MRA PIN Certificate</Form.Label>
                      <Form.Control type="file" onChange={handleFileChange('pinCert')} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Online Presence URL</Form.Label>
                      <Form.Control
                        type="url"
                        value={onlineURL}
                        onChange={e=>setOnlineURL(e.target.value)}
                        placeholder="https://yourcompany.com"
                      />
                    </Form.Group>
                  </>
                ) : (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>ID Card Front</Form.Label>
                      <Form.Control type="file" onChange={handleFileChange('idFront')} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>ID Card Back</Form.Label>
                      <Form.Control type="file" onChange={handleFileChange('idBack')} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Selfie Photo</Form.Label>
                      <Form.Control type="file" onChange={handleFileChange('selfie')} />
                    </Form.Group>
                  </>
                )}
                <Button variant="primary" onClick={handleSubmitAll} disabled={loading}>
                  {loading ? <Spinner animation="border" size="sm"/> : 'Submit for Review'}
                </Button>
              </>
            )}

            {/* Re‑upload Phase */}
            {isReuploadPhase && (
              <>
                {entityType==='company' && (
                  <>
                    {statusData.letterhead_status==='rejected' && (
                      <Form.Group className="mb-3">
                        <Form.Label>Re‑upload Business Certificate</Form.Label>
                        <InputGroup>
                          <Form.Control type="file" onChange={handleFileChange('businessCert')} />
                          <Button
                            variant="success"
                            onClick={handleSingleUpload('businessCert')}
                            disabled={!files.businessCert || loading}
                          >
                            {loading ? <Spinner animation="border" size="sm"/> : 'Upload'}
                          </Button>
                        </InputGroup>
                      </Form.Group>
                    )}
                    {statusData.tin_status==='rejected' && (
                      <Form.Group className="mb-3">
                        <Form.Label>Re‑upload PIN Certificate</Form.Label>
                        <InputGroup>
                          <Form.Control type="file" onChange={handleFileChange('pinCert')} />
                          <Button
                            variant="success"
                            onClick={handleSingleUpload('pinCert')}
                            disabled={!files.pinCert || loading}
                          >
                            {loading ? <Spinner animation="border" size="sm"/> : 'Upload'}
                          </Button>
                        </InputGroup>
                      </Form.Group>
                    )}
                    {/* If domain needs reupload as well */}
                    {statusData.domain != null && statusData.letterhead_status==='rejected' && (
                      <Form.Group className="mb-3">
                        <Form.Label>Re‑upload URL</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type="url"
                            value={onlineURL}
                            onChange={e=>setOnlineURL(e.target.value)}
                          />
                          <Button
                            variant="success"
                            onClick={handleSingleUpload('businessCert')}
                            disabled={!onlineURL || loading}
                          >
                            {loading ? <Spinner animation="border" size="sm"/> : 'Upload URL'}
                          </Button>
                        </InputGroup>
                      </Form.Group>
                    )}
                  </>
                )}
                {entityType==='freelancer' && (
                  <>
                    {statusData.id_front_status==='rejected' && (
                      <Form.Group className="mb-3">
                        <Form.Label>Re‑upload ID Front</Form.Label>
                        <InputGroup>
                          <Form.Control type="file" onChange={handleFileChange('idFront')} />
                          <Button
                            variant="success"
                            onClick={handleSingleUpload('idFront')}
                            disabled={!files.idFront || loading}
                          >
                            {loading ? <Spinner animation="border" size="sm"/> : 'Upload'}
                          </Button>
                        </InputGroup>
                      </Form.Group>
                    )}
                    {statusData.id_back_status==='rejected' && (
                      <Form.Group className="mb-3">
                        <Form.Label>Re‑upload ID Back</Form.Label>
                        <InputGroup>
                          <Form.Control type="file" onChange={handleFileChange('idBack')} />
                          <Button
                            variant="success"
                            onClick={handleSingleUpload('idBack')}
                            disabled={!files.idBack || loading}
                          >
                            {loading ? <Spinner animation="border" size="sm"/> : 'Upload'}
                          </Button>
                        </InputGroup>
                      </Form.Group>
                    )}
                    {statusData.selfie_status==='rejected' && (
                      <Form.Group className="mb-3">
                        <Form.Label>Re‑upload Selfie</Form.Label>
                        <InputGroup>
                          <Form.Control type="file" onChange={handleFileChange('selfie')} />
                          <Button
                            variant="success"
                            onClick={handleSingleUpload('selfie')}
                            disabled={!files.selfie || loading}
                          >
                            {loading ? <Spinner animation="border" size="sm"/> : 'Upload'}
                          </Button>
                        </InputGroup>
                      </Form.Group>
                    )}
                  </>
                )}
              </>
            )}
          </Form>
        </Col>
      </Row>

      {/* Preview Modal */}
      <Modal show={showPreview} onHide={closePreview} centered size="lg">
        <Modal.Body className="text-center">
          <img src={previewSrc} alt="Preview" className="img-fluid" />
        </Modal.Body>
      </Modal>

      {/* Submission Success Modal */}
      <Modal
        show={showSubmitModal}
        onHide={()=>setShowSubmitModal(false)}
        centered
      >
        <Modal.Body className="text-center">
          <p>Your documents have been submitted for review.</p>
          <Button variant="success" onClick={()=>setShowSubmitModal(false)}>
            OK
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}
