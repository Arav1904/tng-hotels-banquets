const express = require('express');
const router = express.Router();

// Create Razorpay order
router.post('/create-order', async (req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId || keyId === 'your_razorpay_key_id') {
    return res.status(503).json({ 
      error: 'Payment gateway not configured.',
      hint: 'Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to backend/.env'
    })
  }

  try {
    const Razorpay = require('razorpay')
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret })
    const { amount, booking_id } = req.body

    if (!amount || amount < 1) {
      return res.status(400).json({ error: 'Invalid amount' })
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: 'INR',
      receipt: `tng_${booking_id}_${Date.now()}`,
      notes: { booking_id: String(booking_id), hotel: 'TNG Hotels & Banquets' },
    })
    res.json({ order })
  } catch (err) {
    console.error('Razorpay error:', err)
    res.status(500).json({ error: 'Payment initialization failed. Please try again.' })
  }
})

// Verify Razorpay payment signature
router.post('/verify', async (req, res) => {
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keySecret || keySecret === 'your_razorpay_key_secret') {
    return res.status(503).json({ error: 'Payment gateway not configured' })
  }
  try {
    const crypto = require('crypto')
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`
    const expectedSign = crypto
      .createHmac('sha256', keySecret)
      .update(sign)
      .digest('hex')
    const isValid = expectedSign === razorpay_signature
    res.json({ verified: isValid })
  } catch (err) {
    res.status(500).json({ error: 'Verification failed' })
  }
})

module.exports = router