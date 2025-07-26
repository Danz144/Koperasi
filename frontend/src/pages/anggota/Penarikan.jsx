// src/pages/Penarikan.jsx
import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import axios from 'axios';
import { FaMoneyBillWave, FaCheck, FaTimes, FaSearchDollar } from 'react-icons/fa';

export default function Penarikan() {
  const [form, setForm] = useState({
    anggotaId: '', // Matches value in select input
    jumlah: '',
    tanggal: '',
    ket: '' // Keterangan
  });
  const [anggotaList, setAnggotaList] = useState([]);
  const [saldo, setSaldo] = useState({ value: null, loading: false });
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  // Base API URL
  const API = 'http://localhost:4000/api';

  // Function to format currency
  const formatCurrency = (number) => {
    if (number === null || isNaN(number)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);
  };

  // Fetch list of anggota on component mount
  useEffect(() => {
    const fetchAnggota = async () => {
      try {
        // Assuming this endpoint returns a list of members with at least anggota_id and name
        const res = await axios.get(`${API}/anggota/list`);
        setAnggotaList(res.data);
      } catch (err) {
        console.error("Failed to fetch anggota list:", err);
        setMsg({ type: 'danger', text: 'Gagal memuat data anggota. Pastikan endpoint /api/anggota/list tersedia.' });
      }
    };
    fetchAnggota();
  }, [API]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // If anggotaId changes, clear the displayed saldo as it's for a different member
    if (name === 'anggotaId') {
      setSaldo({ value: null, loading: false });
      setMsg(null); // Clear messages when member selection changes
    }
  };

  // Function to check balance for the selected anggota
  const checkSaldo = useCallback(async () => {
    if (!form.anggotaId) {
      setMsg({ type: 'warning', text: 'Pilih anggota terlebih dahulu untuk mengecek saldo.' });
      return;
    }
    try {
      setSaldo(prev => ({ ...prev, loading: true })); // Set loading to true
      setMsg(null); // Clear previous messages
      // CORRECTED ENDPOINT: Use /api/penarikan/saldo/:anggota_id as per backend logic
      const res = await axios.get(`${API}/penarikan/saldo/${form.anggotaId}`);
      setSaldo({ value: res.data.saldo, loading: false });
    } catch (err) {
      console.error("Error fetching saldo:", err);
      setSaldo({ value: null, loading: false });
      // Use the error message from the backend if available
      const errorMessage = err.response?.data?.message || 'Gagal mengambil saldo. Periksa koneksi server atau ID anggota.';
      setMsg({ type: 'danger', text: errorMessage });
    }
  }, [form.anggotaId, API]);

  // Optionally, automatically check saldo when anggotaId is selected
  // useEffect(() => {
  //   if (form.anggotaId) {
  //     checkSaldo();
  //   }
  // }, [form.anggotaId, checkSaldo]);


  // Handle form submission for withdrawal
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null); // Clear previous messages

    // Basic client-side validation
    if (!form.anggotaId || !form.jumlah || !form.tanggal) {
      setMsg({ type: 'danger', text: 'Form tidak boleh kosong (Anggota, Jumlah, Tanggal).' });
      setBusy(false);
      return;
    }

    const jumlahPenarikan = parseFloat(form.jumlah);
    if (isNaN(jumlahPenarikan) || jumlahPenarikan <= 0) {
      setMsg({ type: 'danger', text: 'Jumlah penarikan tidak valid. Harus angka positif.' });
      setBusy(false);
      return;
    }

    // Optional: Client-side check against displayed saldo (can be outdated, backend is authoritative)
    if (saldo.value !== null && jumlahPenarikan > saldo.value) {
      setMsg({ type: 'warning', text: `Jumlah penarikan melebihi saldo. Saldo Anda: ${formatCurrency(saldo.value)}` });
      setBusy(false);
      return;
    }

    try {
      // Send POST request to backend
      await axios.post(`${API}/penarikan`, {
        anggota_id: form.anggotaId, // Ensure backend receives anggota_id
        jumlah: jumlahPenarikan,
        tanggal: form.tanggal,
        keterangan: form.ket // Use 'keterangan' as expected by backend
      });

      setMsg({ type: 'success', text: 'Penarikan berhasil disimpan!' });
      // Reset form and saldo display after successful submission
      setForm({ anggotaId: '', jumlah: '', tanggal: '', ket: '' });
      setSaldo({ value: null, loading: false });

    } catch (err) {
      console.error("Withdrawal submission error:", err);
      // Display error message from backend response if available
      const errorMessage = err.response?.data?.message || 'Gagal menyimpan data penarikan. Silakan coba lagi.';
      setMsg({ type: 'danger', text: errorMessage });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container p-4">
      <h2 className="mb-3"><FaMoneyBillWave /> Penarikan Simpanan</h2>

      {msg && (
        <div className={`alert alert-${msg.type}`}>
          {msg.type === 'success' ? <FaCheck /> : <FaTimes />} {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label htmlFor="anggotaId" className="form-label">Anggota</label>
          <div className="input-group">
            <select
              className="form-select"
              id="anggotaId"
              name="anggotaId"
              value={form.anggotaId}
              onChange={handleChange}
              required
            >
              <option value="">-- Pilih Anggota --</option>
              {anggotaList.map(a => (
                <option key={a.anggota_id} value={a.anggota_id}>
                  {a.name} (ID: {a.anggota_id}) {/* Display name for clarity */}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={checkSaldo}
              disabled={!form.anggotaId || saldo.loading}
            >
              {saldo.loading ? 'Cek...' : <><FaSearchDollar /> Cek Saldo</>}
            </button>
          </div>
          {saldo.value !== null && (
            // Display formatted saldo
            <div className="text-success mt-1">Saldo: {formatCurrency(saldo.value)}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="jumlah" className="form-label">Jumlah Penarikan</label>
          <input
            type="number"
            className="form-control"
            id="jumlah"
            name="jumlah"
            value={form.jumlah}
            onChange={handleChange}
            required
            min="1" // Ensure positive number
          />
        </div>

        <div className="mb-3">
          <label htmlFor="tanggal" className="form-label">Tanggal</label>
          <input
            type="date"
            className="form-control"
            id="tanggal"
            name="tanggal"
            value={form.tanggal}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="ket" className="form-label">Keterangan</label>
          <input
            type="text"
            className="form-control"
            id="ket"
            name="ket"
            value={form.ket}
            onChange={handleChange}
            placeholder="Misal: Keperluan pribadi"
          />
        </div>

        <div className="text-end">
          <button className="btn btn-warning" type="submit" disabled={busy}>
            {busy ? 'Menyimpan...' : 'Simpan Penarikan'}
          </button>
        </div>
      </form>
    </div>
  );
}