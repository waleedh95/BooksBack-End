import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();

const pgclient = new Client({
  connectionString: process.env.DATABASE_URL,
});

export default pgclient;
