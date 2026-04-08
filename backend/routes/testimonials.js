const express = require('express');
const { query } = require('../config/db');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  const result = await query('SELECT * FROM testimonials WHERE is_approved = TRUE ORDER BY created_at DESC');
  res.json({ testimonials: result.rows });
});

router.post('/', authenticate, async (req, res) => {
  const { rating, review } = req.body;
  if (!rating || !review) return res.status(400).json({ error: 'Rating and review required' });
  const result = await query(
    'INSERT INTO testimonials (name, location, rating, review, is_approved) VALUES ($1, $2, $3, $4, FALSE) RETURNING *',
    [req.user.name, 'Guest', rating, review]
  );
  res.status(201).json({ testimonial: result.rows[0], message: 'Thank you! Your review will be published after approval.' });
});

module.exports = router;
