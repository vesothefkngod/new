import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import session from 'express-session';
import fetch from 'node-fetch';

dotenv.config();
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'dummy_session_secret_123',
    resave: false,
    saveUninitialized: true
}));
app.use(express.static('public')); // сервира frontend

// ==========================
// Продукти (примерни)
const products = [
    { id: 1, name: 'T-Shirt', price: 2000, currency: 'USD' },
    { id: 2, name: 'Hoodie', price: 4000, currency: 'USD' },
    { id: 3, name: 'Sticker Pack', price: 500, currency: 'USD' }
];

// ==========================
// Route за продукти
app.get('/products', (req, res) => {
    res.json(products);
});

// ==========================
// Checkout route
app.post('/checkout', async (req, res) => {
    const { amount, currency } = req.body;

    if (!amount || !currency) {
        return res.status(400).json({ error: 'Amount and currency required' });
    }

    try {
        const response = await fetch('https://api.oxapay.com/v1/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OXAPAY_API_KEY}`
            },
            body: JSON.stringify({
                amount: amount,
                currency: currency,
                description: 'VNDPrime Store Test Payment'
            })
        });

        const data = await response.json();
        return res.json(data);

    } catch (error) {
        console.error('OxaPay error:', error);
        return res.status(500).json({ error: 'OxaPay request failed' });
    }
});

// ==========================
// Старт на сървъра
// ==========================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
