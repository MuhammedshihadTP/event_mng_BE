import Event from '../models/Event.js';
import { scheduleTasks } from '../utils/scheduler.js';

const computeSchedule = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findById(eventId).populate('tasks.task');

    if (!event) {
      throw new Error('Event not found');
    }

    const { taskOrder, scheduledTasks, totalDuration, planStartDate, planEndDate } = scheduleTasks(
      event.date,
      event.tasks
    );


    res.json({
      taskOrder,
      scheduledTasks: scheduledTasks.map((task) => ({
        taskId: task.taskId,
        description: task.description, 
        startDate: task.startDate,
        endDate: task.endDate,
      })),
      totalDuration,
      planStartDate,
      planEndDate,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export { computeSchedule };