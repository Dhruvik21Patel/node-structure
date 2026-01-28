import { Router } from 'express';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';
import categoryRoutes from './category.routes';
import productRoutes from './product.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);

export default router;
