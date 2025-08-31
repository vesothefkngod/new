import { Router } from 'express';
import { PRODUCTS, getById } from '../data/products.js';

const router = Router();

router.get('/', (req, res) => {
  res.render('design/index', { title: 'Dark Crypto Store', products: PRODUCTS });
});

router.get('/products', (req, res) => {
  res.render('design/products', { title: 'Продукти', products: PRODUCTS });
});

router.get('/products/:id', (req, res) => {
  const product = getById(req.params.id);
  if(!product) return res.status(404).render('404', { title:'Не е намерено' });
  res.render('design/product', { title: product.title, product });
});

router.get('/cart', (req, res) => res.render('design/cart', { title: 'Количка' }));
router.get('/privacy', (req, res) => res.render('design/privacy', { title: 'Privacy' }));
router.get('/terms', (req, res) => res.render('design/terms', { title: 'Terms' }));
router.get('/contact', (req, res) => res.render('design/contact', { title: 'Контакт' }));

export default router;
