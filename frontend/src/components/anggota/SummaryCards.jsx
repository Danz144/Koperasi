// src/components/SummaryCards.jsx
import React from 'react';
import SummaryCard from './SummaryCard'; // Import the individual SummaryCard component
import { formatCurrency } from '../../utils/helper'; // Import helper for currency formatting

/**
 * Renders a collection of summary cards for the dashboard.
 * @param {object} props - The component props.
 * @param {object} props.summaryData - Object containing summary figures.
 * @param {number} props.summaryData.totalSimpanan - Total savings amount.
 * @param {number} props.summaryData.saldoPinjaman - Outstanding loan balance.
 * @param {string} props.summaryData.statusPinjaman - Current loan status.
 * @param {number} props.summaryData.plafonTersedia - Available loan ceiling.
 */
const SummaryCards = ({ summaryData }) => {
  return (
    <div className="row mb-4">
      <div className="col-md-6 col-lg-3">
        <SummaryCard
          title="Total Simpanan"
          value={formatCurrency(summaryData.totalSimpanan)}
          bgColor="bg-success"
        />
      </div>
      <div className="col-md-6 col-lg-3">
        <SummaryCard
          title="Saldo Pinjaman"
          value={formatCurrency(summaryData.saldoPinjaman)}
          bgColor="bg-danger"
        />
      </div>
      <div className="col-md-6 col-lg-3">
        <SummaryCard
          title="Status Pinjaman"
          value={summaryData.statusPinjaman}
          bgColor="bg-warning"
        />
      </div>
      <div className="col-md-6 col-lg-3">
        <SummaryCard
          title="Plafon Tersedia"
          value={formatCurrency(summaryData.plafonTersedia)}
          bgColor="bg-primary"
        />
      </div>
    </div>
  );
};

export default SummaryCards;
