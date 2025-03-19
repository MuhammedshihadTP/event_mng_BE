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

    const duration = (taskData?.duration || 0) / 24; // Convert hours to days
    const offset = (taskData?.offset || 0) / 24; // Convert hours to days

    taskMap[taskData._id.toString()] = {
      ...taskData,
      duration,
      offset,
      description: taskData?.description,
      timing: taskData?.timing || "before", // Default to "before" if not specified
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

  const calculateTotalDuration = (taskId) => {
    const task = taskMap[taskId];
    if (!task) {
      console.error(`Task not found in taskMap for ID: ${taskId}`);
      return 0;
    }

    let totalDuration = task.duration;

    if (dependencies[taskId]?.length > 0) {
      dependencies[taskId].forEach((depId) => {
        const depTask = taskMap[depId];
        if (!depTask) {
          console.error(`Dependency task not found for ID: ${depId}`);
          return;
        }

        // Calculate the duration of the dependency, including its own dependencies
        const depDuration = calculateTotalDuration(depId);

        // Adjust for timing and offset
        if (depTask.timing === "before") {
          // Dependency must complete before the parent task starts
          totalDuration += depDuration + depTask.offset;
        } else if (depTask.timing === "after") {
          // Dependency starts after the parent task completes
          // Ensure the parent task's duration is long enough to accommodate the dependency
          totalDuration = Math.max(totalDuration, depDuration + depTask.offset);
        }
      });
    }

    return totalDuration;
  };

  taskOrder.forEach((taskId) => {
    const task = taskMap[taskId];
    if (!task) {
      console.error(`Task not found in taskMap for ID: ${taskId}`);
      return;
    }

    // Calculate the total duration of the task, including its subtasks
    const totalDuration = calculateTotalDuration(taskId);

    // Update totalEventDuration with the maximum duration
    totalEventDuration = Math.max(totalEventDuration, totalDuration);

    scheduledTasks.push({
      taskId,
      description: task.description,
      duration: totalDuration, // Convert back to hours
      subtaskCount: dependencies[taskId]?.length || 0,
    });
  });

  return {
    taskOrder: scheduledTasks.map((task) => task.taskId),
    scheduledTasks,
    totalEventDuration: totalEventDuration , 
  };
};

export { scheduleTasks };