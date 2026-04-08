const express = require('express');
const router = express.Router();

// Create Razorpay order
router.post('/create-order', async (req, res) => {
  try {
    // Only initialize if keys are provided
    if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'your_razorpay_key_id') {
      return res.status(503).json({ error: 'Payment gateway not configured. Please set up Razorpay keys.' });
    }
    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const { amount, booking_id } = req.body;
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // in paise
      currency: 'INR',
      receipt: `booking_${booking_id}`,
      notes: { booking_id },
    });
    res.json({ order });
  } catch (err) {
    console.error('Razorpay error:', err);
    res.status(500).json({ error: 'Payment initialization failed' });
  }
});

// Verify payment
router.post('/verify', async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET === 'your_razorpay_key_secret') {
      return res.status(503).json({ error: 'Payment gateway not configured' });
    }
    const crypto = require('crypto');
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');
    const isValid = expectedSign === razorpay_signature;
    res.json({ verified: isValid });
  } catch (err) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

module.exports = router;
