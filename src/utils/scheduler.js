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
      (dependencies[taskId] || []).forEach(visit);
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

  // Step 1: Parse tasks and their dependencies
  const addTask = (taskData) => {
    if (!taskData || !taskData._id) return;
    const taskId = taskData._id.toString();

    if (!taskMap[taskId]) {
      taskMap[taskId] = {
        ...taskData,
        duration: taskData.duration || 0, // Duration in hours
        description: taskData.description || "",
      };
    }

    if (!dependencies[taskId]) {
      dependencies[taskId] = [];
    }

    (taskData.dependencies || []).forEach((dep) => {
      const depTask = dep.task || dep;
      const depId = depTask._id?.toString() || depTask.toString();

      if (depId) {
        dependencies[taskId].push(depId);
        addTask(depTask); // Recursively add dependencies
      }
    });
  };

  tasks.forEach((task) => addTask(task.task || task));

  console.log("Task Map:", taskMap);
  console.log("Dependencies:", dependencies);


  const taskOrder = topologicalSort(taskMap, dependencies);

  
  const mainTasks = new Set(Object.keys(taskMap));
  Object.values(dependencies).forEach((deps) => {
    deps.forEach((depId) => mainTasks.delete(depId));
  });

 
  const scheduledTasks = [];
  let totalEventDuration = 0;

  const calculateTotalDuration = (taskId, cache = {}) => {
    if (cache[taskId]) return cache[taskId];

    const task = taskMap[taskId];
    if (!task) {
      console.error(`Task not found in taskMap for ID: ${taskId}`);
      return 0;
    }

    let totalDuration = task.duration;
    dependencies[taskId]?.forEach((depId) => {
      totalDuration += calculateTotalDuration(depId, cache);
    });

    cache[taskId] = totalDuration;
    return totalDuration;
  };

  const cache = {};
  taskOrder.forEach((taskId) => {
    if (mainTasks.has(taskId)) {
      const totalDuration = calculateTotalDuration(taskId, cache);
      const subtaskCount = dependencies[taskId]?.length || 0;

      scheduledTasks.push({
        taskId,
        description: taskMap[taskId]?.description,
        duration: totalDuration,
        subtaskCount, 
      });


      totalEventDuration += totalDuration;
    }
  });

  return {
    scheduledTasks,
    totalEventDuration,
  };
};

export { scheduleTasks };