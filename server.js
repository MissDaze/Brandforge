require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = 4242;

app.use(express.static('.'));
app.use(express.json());

app.post('/create-dev-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: process.env.DEV_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:4242/success.html',
      cancel_url: 'http://localhost:4242/index.html',
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe session error:', err);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ BrandForge Dev tier backend running at http://localhost:${PORT}`);
});
