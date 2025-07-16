// --- src/components/bendahara/SummaryCardsBendahara.jsx ---
import React from 'react';

const formatCurrency = (value) => {
    const number = Number(value) || 0;
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

export default function SummaryCards({ summary }) {
    return (
        <div className="row g-3 mb-4">
            <div className="col-md-3">
                <div className="card text-white bg-primary text-center h-100">
                    <div className="card-body">
                        <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Simpanan Bulan Ini</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formatCurrency(summary.simpanan)}</div>
                    </div>
                </div>
            </div>
            <div className="col-md-3">
                 <div className="card text-white bg-warning text-center h-100">
                    <div className="card-body">
                        <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Penarikan</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formatCurrency(summary.penarikan)}</div>
                    </div>
                </div>
            </div>
            <div className="col-md-3">
                 <div className="card text-white bg-success text-center h-100">
                    <div className="card-body">
                        <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Angsuran</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formatCurrency(summary.angsuran)}</div>
                    </div>
                </div>
            </div>
            <div className="col-md-3">
                 <div className="card text-white bg-dark text-center h-100">
                    <div className="card-body">
                        <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Saldo Kas</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formatCurrency(summary.saldoKas)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}