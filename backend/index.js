const express = require('express');
const app = express();
const cors = require('cors')
require('dotenv').config();

//Anggota
const archiveRoute = require('./routers/anggota/persetujuanRoute');
const authRoute = require('./routers/authRoute');
const usersRoute = require('./routers/usersRoute');
const anggotaRoute = require('./routers/anggota/anggotaRoute');
const simpananRoute = require('./routers/anggota/simpananRoute');
const penarikanSimapananRoute = require('./routers/anggota/penarikanSimapananRoute');
const pinjamanRoute = require('./routers/anggota/pinjamanRoute');
const angsuranRoute = require('./routers/anggota/angsuranRoute');
const transaksiKasRoute = require('./routers/anggota/transaksiKasRoute');
const persetujuanRoute = require('./routers/anggota/persetujuanRoute');
const pengaturanRoute = require('./routers/anggota/pengaturanRoute');

//Ketua
const dashboardKetuaRoute = require('./routers/ketua/dashboardKetuaRoute');
const PengajuanRoute = require('./routers/ketua/pengajuanRoute');
const PersetujuanRoute = require('./routers/ketua/persetujuanRoute');
const LaporanRoute = require('./routers/ketua/laporanRoute');

//Bendahara
const dashboardBendaharaRoute = require('./routers/bendahara/dashboardRoute');
const TransaksiRoute = require('./routers/bendahara/transaksiRoute');



 app.use(
    cors({
        origin : 'http://localhost:5173',
        credentials : true,
    })
)
app.use(express.json());
app.use('/api', archiveRoute);
app.use('/api', authRoute);
app.use('/api', usersRoute);
app.use('/api', anggotaRoute);
app.use('/api', simpananRoute);
app.use('/api', penarikanSimapananRoute);
app.use('/api', pinjamanRoute);
app.use('/api', angsuranRoute);
app.use('/api', transaksiKasRoute);
app.use('/api', persetujuanRoute);
app.use('/api', pengaturanRoute);

app.use('/api', dashboardKetuaRoute);
app.use('/api', PengajuanRoute);
app.use('/api', PersetujuanRoute);
app.use('/api', LaporanRoute);

app.use('/api', dashboardBendaharaRoute);
app.use('/api', TransaksiRoute);




const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
