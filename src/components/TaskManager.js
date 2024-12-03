import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../config';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('due_date');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchTasks();
    fetchCategories();
    fetchTags();
  }, [filter, sortBy, searchTerm, selectedCategory]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      let url = `${baseUrl}/tasks/?ordering=${sortBy}`;
      if (filter !== 'all') {
        url += `&status=${filter}`;
      }
      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }
      if (selectedCategory !== 'all') {
        url += `&category=${selectedCategory}`;
      }
      const response = await axios.get(url, {
        headers: { Authorization: `Token ${token}` }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${baseUrl}/categories/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${baseUrl}/tags/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleCreateTask = async (newTask) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Sending task data:', newTask); // Debug log
      const response = await axios.post(`${baseUrl}/tasks/`, newTask, {
        headers: { 
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Server response:', response.data); // Debug log
      setTasks([...tasks, response.data]);
    } catch (error) {
      console.error('Error creating task:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${baseUrl}/tasks/${updatedTask.id}/`, updatedTask, {
        headers: { Authorization: `Token ${token}` }
      });
      setTasks(tasks.map(task => task.id === updatedTask.id ? response.data : task));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${baseUrl}/tasks/${taskId}/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Task Manager</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Create New Task</h2>
        <TaskForm
          onTaskCreated={handleCreateTask}
          categories={categories}
          tags={tags}
        />
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Your Tasks</h2>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        <TaskList
          tasks={tasks}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          filter={filter}
          setFilter={setFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          categories={categories}
        />
      </div>
    </div>
  );
}

export default TaskManager;