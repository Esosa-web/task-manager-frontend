import React from 'react';
import TaskItem from './TaskItem';

function TaskList({ tasks, onUpdateTask, onDeleteTask, filter, setFilter, sortBy, setSortBy, categories }) {
  const groupTasksByCategory = () => {
    const grouped = {};
    tasks.forEach(task => {
      const categoryName = task.category ? categories.find(c => c.id === task.category)?.name : 'Uncategorized';
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(task);
    });
    return grouped;
  };

  const groupedTasks = groupTasksByCategory();

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="all">All</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="due_date">Due Date</option>
          <option value="priority">Priority</option>
          <option value="-created_at">Created At</option>
        </select>
      </div>
      {Object.entries(groupedTasks).map(([categoryName, categoryTasks]) => (
        <div key={categoryName} className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{categoryName}</h3>
          <div className="space-y-4">
            {categoryTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onUpdate={onUpdateTask}
                onDelete={onDeleteTask}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskList;