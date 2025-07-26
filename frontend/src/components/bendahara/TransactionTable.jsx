// --- src/components/bendahara/TransactionTable.jsx ---
import React from 'react';

const formatCurrency = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

export default function TransactionTable({ data }) {
    return (
        <div className="card">
            <div className="card-header">5 Transaksi Terakhir</div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Tanggal</th>
                                <th>Jenis</th>
                                <th>Sumber</th>
                                <th>Jumlah</th>
                                <th>Keterangan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data && data.map(tx => (
                                <tr key={tx.transaksi_id}>
                                    <td>{new Date(tx.tanggal).toLocaleDateString('id-ID')}</td>
                                    <td>
                                        <span className={`badge bg-${tx.jenis_transaksi === 'masuk' ? 'success' : 'danger'}`}>
                                            {tx.jenis_transaksi}
                                        </span>
                                    </td>
                                    <td>{tx.sumber}</td>
                                    <td className={tx.jenis_transaksi === 'masuk' ? 'text-success' : 'text-danger'}>
                                        {formatCurrency(tx.jumlah)}
                                    </td>
                                    <td>{tx.keterangan}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
