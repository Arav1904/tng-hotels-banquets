const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/db');
const { authenticate, requireAdmin, optionalAuth } = require('../middleware/auth');
const router = express.Router();

// Create booking
router.post('/', optionalAuth,
  [
    body('room_id').isInt(),
    body('guest_name').trim().notEmpty(),
    body('guest_email').isEmail().normalizeEmail(),
    body('guest_phone').notEmpty(),
    body('check_in').isDate(),
    body('check_out').isDate(),
    body('num_guests').isInt({ min: 1 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { room_id, guest_name, guest_email, guest_phone, check_in, check_out, num_guests, special_requests } = req.body;
    try {
      // Validate dates
      if (new Date(check_out) <= new Date(check_in)) {
        return res.status(400).json({ error: 'Check-out must be after check-in' });
      }

      // Get room price
      const roomResult = await query('SELECT * FROM rooms WHERE id = $1 AND is_active = TRUE', [room_id]);
      if (!roomResult.rows.length) return res.status(404).json({ error: 'Room not found' });
      const room = roomResult.rows[0];

      // Check availability
      const booked = await query(
        `SELECT COUNT(*) as cnt FROM bookings WHERE room_id = $1 AND status NOT IN ('cancelled')
         AND NOT (check_out <= $2 OR check_in >= $3)`,
        [room_id, check_in, check_out]
      );
      if (parseInt(booked.rows[0].cnt) >= room.total_rooms) {
        return res.status(409).json({ error: 'Room not available for selected dates' });
      }

      // Calculate total
      const nights = Math.ceil((new Date(check_out) - new Date(check_in)) / (1000 * 60 * 60 * 24));
      const total = room.price_per_night * nights;

      const result = await query(
        `INSERT INTO bookings (user_id, room_id, guest_name, guest_email, guest_phone, check_in, check_out, num_guests, total_amount, special_requests)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [req.user?.id || null, room_id, guest_name, guest_email, guest_phone, check_in, check_out, num_guests, total, special_requests || null]
      );
      res.status(201).json({ booking: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Booking failed' });
    }
  }
);

// Get user's bookings
router.get('/my', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT b.*, r.name as room_name, r.type as room_type, r.images as room_images
       FROM bookings b JOIN rooms r ON b.room_id = r.id
       WHERE b.user_id = $1 ORDER BY b.created_at DESC`,
      [req.user.id]
    );
    res.json({ bookings: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Update payment status after Razorpay
router.put('/:id/payment', optionalAuth, async (req, res) => {
  const { payment_id, status } = req.body;
  try {
    const result = await query(
      `UPDATE bookings SET payment_id = $1, payment_status = $2, status = 'confirmed', updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [payment_id, status, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Booking not found' });
    res.json({ booking: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Payment update failed' });
  }
});

// Cancel booking
router.put('/:id/cancel', authenticate, async (req, res) => {
  try {
    const result = await query(
      `UPDATE bookings SET status = 'cancelled', updated_at = NOW()
       WHERE id = $1 AND (user_id = $2 OR $3 = 'admin') RETURNING *`,
      [req.params.id, req.user.id, req.user.role]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Booking not found' });
    res.json({ booking: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Cancellation failed' });
  }
});

// Admin: get all bookings
router.get('/admin/all', authenticate, requireAdmin, async (req, res) => {
  try {
    const result = await query(
      `SELECT b.*, r.name as room_name, u.email as user_email
       FROM bookings b 
       LEFT JOIN rooms r ON b.room_id = r.id
       LEFT JOIN users u ON b.user_id = u.id
       ORDER BY b.created_at DESC LIMIT 100`
    );
    res.json({ bookings: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});

module.exports = router;
