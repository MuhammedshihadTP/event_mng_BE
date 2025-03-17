import { DateTime } from 'luxon';

const topologicalSort = (tasks, dependencies) => {
  const sorted = [];
  const visited = new Set();
  const visiting = new Set();

  const visit = (taskId) => {
    if (visiting.has(taskId)) {
      throw new Error('Cyclic dependencies detected');
    }
    if (!visited.has(taskId)) {
      visiting.add(taskId);
      dependencies[taskId]?.forEach(visit);
      visiting.delete(taskId);
      visited.add(taskId);
      sorted.push(taskId);
    }
  };

  Object.keys(tasks).forEach((taskId) => {
    if (!visited.has(taskId)) {
      visit(taskId);
    }
  });

  return sorted;
};

const scheduleTasks = (eventDate, tasks) => {
  const taskMap = {};
  const dependencies = {};

  tasks.forEach((task) => {
    
    const duration = task.duration || task.task.duration || 1; // Default duration: 1 hour
    const offset = task.offset || task.task.offset || 0; // Default offset: 0 hours

    taskMap[task.task._id] = {
      ...task.task,
      duration,
      offset,
      description: task.task.description
    };
    dependencies[task.task._id] = task.dependencies || task.task.dependencies;
  });

  const taskOrder = topologicalSort(taskMap, dependencies);


  const scheduledTasks = [];

  let totalDuration = 0;

  taskOrder.forEach((taskId) => {
    const task = taskMap[taskId];
    const offsetHours = task.offset * (task.timing === 'before' ? -1 : 1);
    const taskStartDate = DateTime.fromJSDate(eventDate).plus({ hours: offsetHours });
    const taskEndDate = taskStartDate.plus({ hours: task.duration });

    scheduledTasks.push({
      taskId,
      description: task?.description,
      startDate: taskStartDate.toJSDate(),
      endDate: taskEndDate.toJSDate(),
    });

    totalDuration += task.duration;
  });

  const planStartDate = scheduledTasks[0].startDate;
  const planEndDate = scheduledTasks[scheduledTasks.length - 1].endDate;

  return {
    taskOrder: scheduledTasks.map((task) => task.taskId),
    scheduledTasks,
    totalDuration,
    planStartDate,
    planEndDate,
  };
};

export { scheduleTasks };