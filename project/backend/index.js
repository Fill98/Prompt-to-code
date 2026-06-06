const express = require('express');
const cors = require('cors');
const { initDB } = require('./db/database');
const logsRouter = require('./routes/logs');
const globalRouter = require('./routes/global');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

initDB();

app.use('/api/logs', logsRouter);
app.use('/api/global', globalRouter);

app.get('/health', (_, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
