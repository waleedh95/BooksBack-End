// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import bookRoutes from './routes/books.js';
import pgclient from './db.js';

dotenv.config();

const app = express();
app.use(morgan('dev'));       // request logging
app.use(cors());
app.use(express.json());

// mount routes
app.use('/api/books', bookRoutes);

// health check & 404
app.get('/', (req, res) => res.send('📚 Books API is running'));
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

const PORT = process.env.PORT || 3001;

// connect to PG, then start server
(async () => {
  try {
    await pgclient.connect();
    console.log('Connected to Postgres');
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
})();
