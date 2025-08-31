import { Router } from 'express';
import bcrypt from 'bcrypt';
import { query } from '../db.js';

const router = Router();

router.get('/login', (req, res) => {
  const a = Math.floor(Math.random()*10)+1;
  const b = Math.floor(Math.random()*10)+1;
  req.session.captcha = a + b;
  res.render('auth/login', { title: 'Вход', captchaQuestion: `${a} + ${b} = ?` });
});

router.post('/login', async (req, res) => {
  const { username, password, captcha } = req.body;
  if (!username || !password) {
    req.session.flash = { type: 'error', text: 'Попълни потребител и парола.' };
    return res.redirect('/auth/login');
  }
  if (!captcha || Number(captcha) !== Number(req.session.captcha)) {
    req.session.flash = { type: 'error', text: 'Грешен captcha.' };
    return res.redirect('/auth/login');
  }
  const result = await query('SELECT * FROM users WHERE username=$1', [username]);
  const user = result.rows[0];
  if (!user) {
    req.session.flash = { type: 'error', text: 'Невалидни данни.' };
    return res.redirect('/auth/login');
  }
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    req.session.flash = { type: 'error', text: 'Невалидни данни.' };
    return res.redirect('/auth/login');
  }
  req.session.user = { id: user.id, username: user.username };
  req.session.flash = { type: 'success', text: 'Успешен вход.' };
  res.redirect('/');
});

router.get('/register', (req, res) => {
  const a = Math.floor(Math.random()*10)+1;
  const b = Math.floor(Math.random()*10)+1;
  req.session.captcha = a + b;
  res.render('auth/register', { title: 'Регистрация', captchaQuestion: `${a} + ${b} = ?` });
});

router.post('/register', async (req, res) => {
  const { username, password, password2, captcha } = req.body;
  if (!username || !password || !password2) {
    req.session.flash = { type: 'error', text: 'Попълни полетата.' };
    return res.redirect('/auth/register');
  }
  if (password !== password2) {
    req.session.flash = { type: 'error', text: 'Паролите не съвпадат.' };
    return res.redirect('/auth/register');
  }
  if (!captcha || Number(captcha) !== Number(req.session.captcha)) {
    req.session.flash = { type: 'error', text: 'Грешен captcha.' };
    return res.redirect('/auth/register');
  }
  const hashed = await bcrypt.hash(password, 10);
  try {
    await query('INSERT INTO users(username,password_hash) VALUES($1,$2)', [username, hashed]);
    req.session.flash = { type: 'success', text: 'Акаунтът е създаден.' };
    res.redirect('/auth/login');
  } catch (err) {
    console.error('Register error', err.message);
    req.session.flash = { type: 'error', text: 'Потребителското име е заето.' };
    res.redirect('/auth/register');
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(()=> res.redirect('/'));
});

export default router;
