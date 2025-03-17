import express from 'express';
import { computeSchedule } from '../controllers/scheduleController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:eventId/compute-schedule', authMiddleware, computeSchedule);

export default router;