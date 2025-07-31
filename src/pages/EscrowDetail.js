import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Spinner,
  Alert,
  Container,
  Badge,
  Card,
  Row,
  Col
} from 'react-bootstrap';
import { BsCheckCircle, BsExclamationCircle } from 'react-icons/bs';
import api from '../utils/api'; 

export default function EscrowDetail() {
  const { tx_ref } = useParams();
  const [escrow, setEscrow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    api.get(`/api/escrow/${tx_ref}`)
      .then(({ data }) => setEscrow(data))
      .catch(err => setError(err.response?.data?.message || 'Not found'))
      .finally(() => setLoading(false));
  }, [tx_ref]);

  const fmt = (amt) => new Intl.NumberFormat('en-MW', {
    style: 'currency',
    currency: 'MWK',
    minimumFractionDigits: 2
  }).format(amt);

  const formatDate = (d) => new Date(d).toLocaleString();

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h3 className="mb-4 text-success">Escrow Transaction Details</h3>

      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <Row className="mb-3">
            <Col md={6}>
              <p><strong>Transaction Reference:</strong> {escrow.tx_ref}</p>
            </Col>
            <Col md={6}>
              <p><strong>Gig ID:</strong> {escrow.gig_id}</p>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <p><strong>Amount:</strong> {fmt(escrow.amount)}</p>
            </Col>
            <Col md={6}>
              <p>
                <strong>Status:</strong>{' '}
                <Badge bg={escrow.paid ? 'success' : 'warning'}>
                  {escrow.paid
                    ? <>
                        <BsCheckCircle className="me-1" />
                        Released
                      </>
                    : <>
                        <BsExclamationCircle className="me-1" />
                        Held
                      </>
                  }
                </Badge>
              </p>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <p><strong>Payment Method:</strong> {escrow.payment_method}</p>
            </Col>
            
          </Row>

          <Row>
            <Col md={6}>
              <p><strong>Created At:</strong> {formatDate(escrow.created_at)}</p>
            </Col>
            <Col md={6}>
              <p>
                <strong>Released At:</strong>{' '}
                {escrow.paid_at ? formatDate(escrow.paid_at) : 'Not yet released'}
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}
