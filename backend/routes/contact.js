const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/db');
const router = express.Router();

router.post('/',
  [
    body('name').trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('message').trim().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { name, email, phone, subject, message } = req.body;
    await query(
      'INSERT INTO contacts (name, email, phone, subject, message) VALUES ($1, $2, $3, $4, $5)',
      [name, email, phone || null, subject || null, message]
    );
    res.status(201).json({ message: 'Message received! We will get back to you within 24 hours.' });
  }
);

module.exports = router;
