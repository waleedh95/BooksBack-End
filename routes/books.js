import express from 'express';
import pgclient from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pgclient.query('SELECT * FROM books');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pgclient.query(
      'SELECT * FROM books WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  const { title, author, year } = req.body;
  if (!title || !author || !year) {
    return res
      .status(400)
      .json({ error: 'Missing required fields: title, author, year' });
  }

  try {
    const result = await pgclient.query(
      'INSERT INTO books (title, author, year) VALUES ($1, $2, $3) RETURNING *',
      [title, author, year]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', async (req, res) => {
  const { title, author, year } = req.body;
  if (!title || !author || !year) {
    return res
      .status(400)
      .json({ error: 'Missing required fields: title, author, year' });
  }

  try {
    const result = await pgclient.query(
      'UPDATE books SET title=$1, author=$2, year=$3 WHERE id=$4 RETURNING *',
      [title, author, year, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pgclient.query(
      'DELETE FROM books WHERE id = $1',
      [req.params.id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
