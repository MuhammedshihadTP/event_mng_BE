import Task from "../models/Task.js";


const createTask = async (req, res) => {
  const { type,  description, duration, dependencies, timing, offset } = req.body;
  try {
    const task = await Task.create({ type, user:req?.userId, description, duration, dependencies, timing, offset });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getTasks = async (req, res) => {
  const { type } = req.query;
  const userId = req.userId; 

  try {
    let tasks;

    if (type === 'global') {
      tasks = await Task.find({ type: 'global' });
    } else if (type === 'private') {
      tasks = await Task.find({ type: 'private', user: userId });
    } else {
    
      tasks = await Task.find({
        $or: [
          { type: 'global' }, 
          { type: 'private' },
        ],
      });
    }

    res.json(tasks);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getTaskById = async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await Task.findById(taskId);
    if (!task) throw new Error('Task not found');
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const updates = req.body;
  try {
    const task = await Task.findByIdAndUpdate(taskId, updates, { new: true });
    if (!task) throw new Error('Task not found');
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) throw new Error('Task not found');
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export { createTask, getTasks, getTaskById, updateTask, deleteTask };