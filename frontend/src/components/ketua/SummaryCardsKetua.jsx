// --- src/components/ketua/SummaryCardsKetua.jsx ---
import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const formatCurrency = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

// Sub-komponen untuk satu kartu, bisa juga dipisah jika makin kompleks
const SummaryCard = ({ title, value, bg, isCurrency = false }) => (
    <Card bg={bg} text="white" className="h-100 shadow-sm">
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text className="fs-4 fw-bold">
          {isCurrency ? formatCurrency(value) : value}
        </Card.Text>
      </Card.Body>
    </Card>
);

const SummaryCardsKetua = ({ summary }) => {
  return (
    <Row className="mb-4">
      <Col md={6} lg={3} className="mb-3">
        <SummaryCard title="Total Pengajuan" value={summary.total_pengajuan} bg="info" />
      </Col>
      <Col md={6} lg={3} className="mb-3">
        <SummaryCard title="Disetujui" value={summary.total_disetujui} bg="success" />
      </Col>
      <Col md={6} lg={3} className="mb-3">
        <SummaryCard title="Ditolak" value={summary.total_ditolak} bg="danger" />
      </Col>
      <Col md={6} lg={3} className="mb-3">
        <SummaryCard title="Total Tersalur" value={summary.total_tersalur} bg="primary" isCurrency />
      </Col>
    </Row>
  );
};

export default SummaryCardsKetua;