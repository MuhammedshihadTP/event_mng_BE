import express from 'express';
import authRoutes from './authRoutes.js';
import taskRoutes from './taskRoutes.js';
import eventRoutes from './eventRoutes.js';
import scheduleRoutes from './scheduleRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/events', eventRoutes);
router.use('/schedule', scheduleRoutes);

export default router;
