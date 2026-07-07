import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Route Mappings
import authRoutes from './routes/auth';
import requestsRoutes from './routes/requests';
import inventoryRoutes from './routes/inventory';
import aiRoutes from './routes/ai';
import donorsRoutes from './routes/donors';

// Initialize environment
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Global Middleware
app.use(cors());
app.use(express.json());

// API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestsRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/donors', donorsRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'MedBridge AI Coordination Backend Server is online.',
    data: {
      timestamp: new Date(),
      status: 'healthy',
    },
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`[MedBridge Backend] Server is running successfully on http://localhost:${PORT}`);
});
