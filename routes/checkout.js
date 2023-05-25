// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
// stripe.js
const express = require('express');
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

const router = express.Router();

const YOUR_DOMAIN = 'https://main--rococo-semifreddo-f6db94.netlify.app';

router.post('/create-checkout-session', async (req, res) => {
  console.log('REQUEST BODY FOR PAY', req.body);
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price_data: {
          product_data: {
            name: req.body.name,
            description: req.body.description,
            images: [req.data.imageUrl],
          },
          unit_amount: req.body.value,
        },
        quantity: req.body.quantity,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/order?success=true`,
    cancel_url: `${YOUR_DOMAIN}/order?canceled=true`,
  });

  res.redirect(303, session.url);
});

module.exports = router;
