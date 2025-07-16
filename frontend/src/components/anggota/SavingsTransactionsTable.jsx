// src/components/SavingsTransactionsTable.jsx
import React from 'react';
import { format } from 'date-fns';
import { formatCurrency } from '../../utils/helper'

/**
 * Renders a table for recent savings transactions.
 * @param {object} props - The component props.
 * @param {Array<object>} props.transactions - Array of transaction objects.
 * @param {string} props.transactions[].tanggal_simpan - Date of the transaction.
 * @param {string} props.transactions[].jenis_simpanan - Type of savings (e.g., "Wajib", "Sukarela").
 * @param {number} props.transactions[].jumlah - Amount of the transaction.
 */
const SavingsTransactionsTable = ({ transactions }) => (
  <div className="card shadow-sm">
    <div className="card-body">
      <h5 className="card-title">Buku Simpanan</h5>
      <div className="table-responsive rounded">
        <table className="table table-striped table-hover mb-0">
          <thead className="bg-light">
            <tr>
              <th scope="col">Tanggal</th>
              <th scope="col">Jenis</th>
              <th scope="col">Nominal</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr key={index}>
                <td>{format(new Date(tx.tanggal_simpan), 'yyyy-MM-dd')}</td>
                <td>{tx.jenis_simpanan}</td>
                <td>{formatCurrency(tx.jumlah)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default SavingsTransactionsTable;
