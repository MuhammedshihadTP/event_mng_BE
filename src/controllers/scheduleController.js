import Event from '../models/Event.js';
import { scheduleTasks } from '../utils/scheduler.js';

const computeSchedule = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findById(eventId)
    .populate({
      path: "tasks.task",
      populate: {
        path: "dependencies.task", 
        model: "Task",
      },
    });


    if (!event) {
      throw new Error('Event not found');
    }

    const { taskOrder, scheduledTasks, totalDuration, planStartDate, planEndDate,totalEventDuration } = scheduleTasks(
      event.date,
      event.tasks
    );


    res.json({
      taskOrder,
      scheduledTasks: scheduledTasks.map((task) => ({
        taskId: task.taskId,
        duration:task?.duration,
        description: task.description, 
       
      })),
    
      totalEventDuration
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export { computeSchedule };