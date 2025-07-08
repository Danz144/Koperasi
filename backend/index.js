const express = require('express');
const app = express();
const cors = require('cors')
require('dotenv').config();

const archiveRoute = require('./routers/persetujuanRoute');
const authRoute = require('./routers/authRoute');
const usersRoute = require('./routers/usersRoute');
const anggotaRoute = require('./routers/anggotaRoute');
const simpananRoute = require('./routers/simpananRoute');
const penarikanSimapananRoute = require('./routers/penarikanSimapananRoute');
const pinjamanRoute = require('./routers/pinjamanRoute');
const angsuranRoute = require('./routers/angsuranRoute');
const transaksiKasRoute = require('./routers/transaksiKasRoute');
const persetujuanRoute = require('./routers/persetujuanRoute');
const pengaturanRoute = require('./routers/pengaturanRoute');



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


const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
