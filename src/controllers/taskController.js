import Task from "../models/Task.js";


const createTask = async (req, res) => {
  const { type, description, duration, dependencies, timing, offset } = req.body;

  console.log(req.body,"sssss");
  
  try {
  
    const formattedDependencies = dependencies?.map((taskId) => ({ task: taskId })) || [];

    const task = await Task.create({
      type,
      user: req?.userId,
      description,
      duration,
      dependencies: formattedDependencies, 
      timing,
      offset,
    });

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
      tasks = await Task.find({ type: 'global' }).populate("dependencies.task");
    } else if (type === 'private') {
      tasks = await Task.find({ type: 'private', user: userId }).populate("dependencies.task");
      
    } else {
    
      tasks = await Task.find({
        $or: [
          { type: 'global' }, 
          { type: 'private' },
        ],
      }).populate("dependencies.task");

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
    // Format dependencies properly if present in the request body
    if (updates.dependencies) {
      updates.dependencies = updates.dependencies.map((taskId) => ({ task: taskId }));
    }

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