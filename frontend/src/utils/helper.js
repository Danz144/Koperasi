// src/utils/helpers.js

/**
 * Formats a number as Indonesian Rupiah currency.
 * @param {number} amount - The amount to format.
 * @returns {string} The formatted currency string.
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};
