import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import session from 'express-session';
import helmet from 'helmet';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { initDb } from './src/db.js';
import shopRoutes from './src/routes/shop.js';
import authRoutes from './src/routes/auth.js';
import payRoutes from './src/routes/pay.js';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(helmet());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'devsecret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: false }
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;
  next();
});

await initDb();

app.use('/', shopRoutes);
app.use('/auth', authRoutes);
app.use('/pay', payRoutes);

app.use((req, res) => {
  res.status(404).render('404', { title: '404 | Page Not Found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
