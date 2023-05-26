// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
// stripe.js
const express = require('express');
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

const router = express.Router();

const YOUR_DOMAIN = 'http://localhost:3000';
// const YOUR_DOMAIN = 'https://main--rococo-semifreddo-f6db94.netlify.app';

router.post('/create-checkout-session', async (req, res) => {
  console.log('REQUEST BODY FOR PAY', req.body);

  const cart = req.body.map((item) => {
    const itemObject = {
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.description,
        },
        unit_amount: item.value,
      },
      quantity: item.quantity || 1,
    };
    return itemObject;
  });

  console.log('CART', cart);
  const session = await stripe.checkout.sessions.create({
    line_items: cart,

    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/order?success=true`,
    cancel_url: `${YOUR_DOMAIN}/order?canceled=true`,
  });

  res.json({ url: session.url });
});

module.exports = router;
