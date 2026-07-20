import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { certificatesRouter } from './modules/certificates/certificates.routes';
import { rankingsRouter } from './modules/rankings/rankings.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/certificates', certificatesRouter);
app.use('/api/rankings', rankingsRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🐱 Michi Godín Backend corriendo en puerto ${PORT}`);
});

export default app;
