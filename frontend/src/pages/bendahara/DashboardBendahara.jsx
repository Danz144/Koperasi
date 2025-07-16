// --- src/pages/DashboardBendahara.jsx ---
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import TransactionTable from '../../components/bendahara/transactiontable';
import PieChartKas from '../../components/bendahara/piechartkas';
import LineChartKas from '../../components/bendahara/linechartkas';
import SummaryCards from '../../components/bendahara/summarycards';

// Impor komponen-komponen presentasi yang sudah dipisah


export default function DashboardBendahara() {
    // Semua state sekarang dikelola di sini
    const [summary, setSummary] = useState({ simpanan: 0, penarikan: 0, angsuran: 0, saldoKas: 0 });
    const [lineData, setLineData] = useState([]);
    const [pieData, setPieData] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Logika pengambilan data dipindahkan ke sini
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:4000/api/bendahara/dashboard');
            const data = response.data;
            
            setSummary({
                simpanan: data.summary.simpananBulanIni,
                penarikan: data.summary.totalPenarikan,
                angsuran: data.summary.totalAngsuran,
                saldoKas: data.summary.saldoKas,
            });
            setLineData(data.lineData);
            setPieData(data.pieData);
            setTransactions(data.transactions);

        } catch (err) {
            console.error("Failed to fetch dashboard data:", err);
            setError("Gagal memuat data dari server.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) return <div className="p-4">Memuat data dashboard...</div>;
    if (error) return <div className="p-4 alert alert-danger">{error}</div>;

    return (
        <div className="p-4">
            <h2 className="mb-4">Dashboard Bendahara</h2>
            
            {/* Meneruskan data ke komponen anak melalui props */}
            <SummaryCards summary={summary} />

            <div className="row mb-4">
                <div className="col-lg-8 mb-4">
                    <LineChartKas data={lineData} />
                </div>
                <div className="col-lg-4 mb-4">
                    <PieChartKas data={pieData} />
                </div>
            </div>

            <TransactionTable data={transactions} />
        </div>
    );
}