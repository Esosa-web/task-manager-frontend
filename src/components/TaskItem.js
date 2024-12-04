import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../config';

const getContrastColor = (hexColor) => {
  hexColor = hexColor.replace('#', '');
  const r = parseInt(hexColor.substr(0,2),16);
  const g = parseInt(hexColor.substr(2,2),16);
  const b = parseInt(hexColor.substr(4,2),16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? 'black' : 'white';
};

function TaskItem({ task, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [taskCategory, setTaskCategory] = useState(null);

  useEffect(() => {
    if (task.category) {
      fetchCategory(task.category);
    }
  }, [task.category]);

  const fetchCategory = async (categoryId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${baseUrl}/categories/${categoryId}/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setTaskCategory(response.data);
    } catch (error) {
      console.error('Error fetching category:', error);
    }
  };

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => {
    onUpdate(editedTask);
    setIsEditing(false);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'due_date') {
      const [unused, currentTime] = editedTask.due_date.split('T');
      setEditedTask({ ...editedTask, due_date: `${value}T${currentTime || '00:00'}` });
    } else {
      setEditedTask({ ...editedTask, [name]: value });
    }
  };

  const handleTimeChange = (e) => {
    const { value } = e.target;
    const [currentDate] = editedTask.due_date.split('T');
    setEditedTask({ ...editedTask, due_date: `${currentDate}T${value}:00` });
  };

  const priorityLabels = ['Low', 'Medium', 'High'];
  const priorityColors = ['bg-green-200', 'bg-yellow-200', 'bg-red-200'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            name="title"
            value={editedTask.title}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <textarea
            name="description"
            value={editedTask.description}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows="3"
          />
          <div className="flex space-x-2">
            <input
              type="date"
              name="due_date"
              value={editedTask.due_date.split('T')[0]}
              onChange={handleChange}
              className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <input
              type="time"
              name="due_time"
              value={editedTask.due_date.split('T')[1]?.slice(0, 5) || ''}
              onChange={handleTimeChange}
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <select
            name="priority"
            value={editedTask.priority}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {priorityLabels.map((label, index) => (
              <option key={index} value={index}>{label}</option>
            ))}
          </select>
          <select
            name="status"
            value={editedTask.status}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <div className="flex justify-end space-x-2">
            <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300">Save</button>
            <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300">Cancel</button>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{task.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{task.description}</p>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">Due: {new Date(task.due_date).toLocaleString()}</span>
            <span className={`text-sm px-2 py-1 rounded-full ${priorityColors[task.priority]} text-gray-800`}>
              {priorityLabels[task.priority]}
            </span>
            <span className="text-sm bg-blue-200 text-blue-800 px-2 py-1 rounded-full">{task.status}</span>
            {taskCategory && (
              <span 
                className="text-sm px-2 py-1 rounded-full" 
                style={{ backgroundColor: taskCategory.color, color: getContrastColor(taskCategory.color) }}
              >
                {taskCategory.name}
              </span>
            )}
          </div>
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {task.tags.map(tag => (
                <span key={tag.id} className="text-sm bg-gray-200 text-gray-800 px-2 py-1 rounded-full">
                  {tag.name}
                </span>
              ))}
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <button onClick={handleEdit} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">Edit</button>
            <button onClick={() => onDelete(task.id)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300">Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskItem;