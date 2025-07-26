// src/components/SummaryCard.jsx
import React from 'react';

/**
 * A reusable card component for displaying summary information.
 * @param {object} props - The component props.
 * @param {string} props.title - The title of the card.
 * @param {string} props.value - The value to display on the card.
 * @param {string} props.bgColor - The Bootstrap background color class (e.g., "bg-success", "bg-danger").
 */
const SummaryCard = ({ title, value, bgColor }) => (
  <div className={`card text-white mb-3 ${bgColor}`}>
    <div className="card-body">
      <h5 className="card-title">{title}</h5>
      <p className="card-text fs-3 fw-bold">{value}</p>
    </div>
  </div>
);

export default SummaryCard;
