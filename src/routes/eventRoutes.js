import express from 'express';
import { createEvent, getEvents, getEventById, updateEvent, deleteEvent } from '../controllers/eventController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createEvent);
router.get('/', authMiddleware, getEvents);
router.get('/:eventId', authMiddleware, getEventById);
router.put('/:eventId', authMiddleware, updateEvent);
router.delete('/:eventId', authMiddleware, deleteEvent);

export default router;