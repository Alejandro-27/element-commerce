import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

// Importación de rutas
import productRoutes from './routes/product/product.routes.js';
import userRoutes from './routes/users/users.routes.js';
import orderRoutes from './routes/users/order.routes.js';
import cartRoutes from './routes/ShoppingCart/ShoppingCart.routes.js';

const app = express();

// 1. Middlewares de Seguridad y Red
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true, // Requerido para transferir Cookies HttpOnly con JWT
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// 2. Middlewares de Rendimiento y Parseo
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 3. Healthcheck Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

// 4. Montaje de Rutas de la API REST
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/shoppingCart', cartRoutes);

export default app;