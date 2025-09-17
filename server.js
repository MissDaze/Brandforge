require('dotenv').config();

const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = 4242;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('BrandForge backend is live');
});

app.post('/create-dev-session', async (req, res) => {
  console.log('Received request: /create-dev-session');
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{
        price: 'price_1S81JYBPdvvseMCG3hRgdq4x',
        quantity: 1,
      }],
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error('Error in /create-dev-session:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
