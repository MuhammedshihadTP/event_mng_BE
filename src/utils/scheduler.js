

const topologicalSort = (tasks, dependencies) => {
  const sorted = [];
  const visited = new Set();
  const visiting = new Set();

  const visit = (taskId) => {
    if (visiting.has(taskId)) {
      throw new Error("Cyclic dependencies detected");
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
    const taskData = task?.task || task;
    if (!taskData?._id) {
      console.error("Task is missing _id:", taskData);
      return;
    }

    const duration = (taskData?.duration || 0) / 24; 
    const offset = (taskData?.offset || 0) / 24; 

    taskMap[taskData._id.toString()] = {
      ...taskData,
      duration,
      offset,
      description: taskData?.description,
    };

    dependencies[taskData._id.toString()] = (taskData.dependencies || []).map(
      (dep) => dep.task.toString()
    );
  });

  console.log("Task Map:", taskMap);
  console.log("Dependencies:", dependencies);

  const taskOrder = topologicalSort(taskMap, dependencies);

  const scheduledTasks = [];
  const taskCompletionTime = {};
  let totalEventDuration = 0;

  taskOrder.forEach((taskId) => {
    const task = taskMap[taskId];
    if (!task) {
      console.error(`Task not found in taskMap for ID: ${taskId}`);
      return;
    }

    let maxDependencyTime = 0;


    const getMaxCompletionTime = (depId) => {
      if (taskCompletionTime[depId] !== undefined) {
        return taskCompletionTime[depId];
      }

      if (dependencies[depId]) {
        return Math.max(
          0,
          ...dependencies[depId].map(getMaxCompletionTime)
        );
      }
      return 0;
    };

    if (dependencies[taskId]?.length > 0) {
      maxDependencyTime = Math.max(
        maxDependencyTime,
        ...dependencies[taskId].map(getMaxCompletionTime)
      );
    }

    const taskStartTime = maxDependencyTime + task.offset;
    const taskEndTime = taskStartTime + task.duration;
    taskCompletionTime[taskId] = taskEndTime;

    // **Add dependency completion time to the task duration**
    const totalDuration = task.duration + maxDependencyTime;

    totalEventDuration = Math.max(totalEventDuration, taskEndTime);

    scheduledTasks.push({
      taskId,
      description: task.description,
      startTime: taskStartTime * 24, 
      duration: totalDuration * 24, 
      endTime: taskEndTime * 24, 
    });
  });

  return {
    taskOrder: scheduledTasks.map((task) => task.taskId),
    scheduledTasks,
    totalEventDuration: totalEventDuration * 24, 
  };
};

export { scheduleTasks };
