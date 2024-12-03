import React, { useState } from 'react';

function TaskForm({ onTaskCreated, categories, tags }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState('0');
  const [status, setStatus] = useState('To Do');
  const [category, setCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let combinedDueDate = null;
    if (dueDate) {
      combinedDueDate = dueTime 
        ? `${dueDate}T${dueTime}:00Z` 
        : `${dueDate}T00:00:00Z`;
    }
    const newTask = {
      title,
      description,
      due_date: combinedDueDate,
      priority: parseInt(priority),
      status,
      category: category || null,
      tag_ids: selectedTags
    };
    try {
      await onTaskCreated(newTask);
      // Reset form
      setTitle('');
      setDescription('');
      setDueDate('');
      setDueTime('');
      setPriority('0');
      setStatus('To Do');
      setCategory('');
      setSelectedTags([]);
    } catch (error) {
      console.error('Error creating task:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        required
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task description"
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        rows="3"
      />
      <div className="flex space-x-2">
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <input
          type="time"
          value={dueTime}
          onChange={(e) => setDueTime(e.target.value)}
          className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      >
        <option value="0">Low Priority</option>
        <option value="1">Medium Priority</option>
        <option value="2">High Priority</option>
      </select>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      >
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      >
        <option value="">Select a category</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tags:</label>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <label key={tag.id} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={selectedTags.includes(tag.id)}
                onChange={() => {
                  setSelectedTags(prevTags =>
                    prevTags.includes(tag.id)
                      ? prevTags.filter(id => id !== tag.id)
                      : [...prevTags, tag.id]
                  );
                }}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{tag.name}</span>
            </label>
          ))}
        </div>
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300">
        Create Task
      </button>
    </form>
  );
}

export default TaskForm;