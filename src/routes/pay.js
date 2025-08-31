import { Router } from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db.js';

const router = Router();

router.post('/checkout', async (req, res) => {
  const { productId } = req.body;
  const gateway = 'OxaPay';
  const user = req.session.user || null;
  const product = (await import('../data/products.js')).getById(productId);
  if(!product) return res.status(400).send('Invalid product');
  const apiKey = process.env.OXAPAY_API_KEY;
  const baseUrl = process.env.OXAPAY_BASE_URL || 'https://sandbox-api.oxapay.com/merchant/v1';
  if(!apiKey) {
    req.session.flash = { type:'error', text:'Липсват OxaPay креденшъли (в .env).' };
    return res.redirect('back');
  }
  try {
    const insert = await query('INSERT INTO orders(user_id, product_id, amount, status) VALUES($1,$2,$3,$4) RETURNING id', [
      user ? user.id : null, product.id, product.price, 'pending'
    ]);
    const orderId = insert.rows[0].id;
    const payload = {
      merchant: process.env.OXAPAY_MERCHANT_ID || 'demo',
      amount: product.price,
      currency: 'EUR',
      order_id: uuidv4(),
      metadata: { orderId },
      success_url: `${req.protocol}://${req.get('host')}/pay/success`,
      cancel_url: `${req.protocol}://${req.get('host')}/pay/cancel`,
      callback_url: `${req.protocol}://${req.get('host')}/pay/webhook/oxapay`
    };
    const resp = await axios.post(`${baseUrl}/invoice`, payload, {
      headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${apiKey}` }
    });
    const invoiceUrl = resp?.data?.invoice_url || resp?.data?.url || null;
    return res.render('design/checkout', { title:'Плащане', amount: product.price, gateway, invoiceUrl });
  } catch (err) {
    console.error('Checkout error', err.message || err);
    req.session.flash = { type:'error', text:'Грешка при създаване на фактура.' };
    return res.redirect('back');
  }
});

router.get('/success', (req, res) => res.render('design/success', { title:'Успешно' }));
router.get('/cancel', (req, res) => res.render('design/cancel', { title:'Отказано' }));
router.post('/webhook/oxapay', async (req, res) => {
  console.log('Webhook', req.body);
  res.status(200).send('ok');
});
export default router;
