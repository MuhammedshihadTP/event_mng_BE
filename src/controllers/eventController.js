import Event from '../models/Event.js';

const createEvent = async (req, res) => {
  const {  name, description, date, tasks } = req.body;
  try {
    const event = await Event.create({ user: req.userId, name, description, date, tasks });
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ user: req.userId }).populate({
      path: 'tasks.task',  
    });
    res.json(events);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getEventById = async (req, res) => {
  const { eventId } = req.params;
  try {
    const event = await Event.findById(eventId);
    if (!event) throw new Error('Event not found');
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateEvent = async (req, res) => {
  const { eventId } = req.params;
  const updates = req.body;
  try {
    const event = await Event.findByIdAndUpdate(eventId, updates, { new: true });
    if (!event) throw new Error('Event not found');
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteEvent = async (req, res) => {
  const { eventId } = req.params;
  try {
    const event = await Event.findByIdAndDelete(eventId);
    if (!event) throw new Error('Event not found');
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export { createEvent, getEvents, getEventById, updateEvent, deleteEvent };