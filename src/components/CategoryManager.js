import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../config';

function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#000000');

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${baseUrl}/categories/`, 
        { name: newCategoryName, color: newCategoryColor },
        { headers: { Authorization: `Token ${token}` } }
      );
      
      setCategories([...categories, response.data]);
      setNewCategoryName('');
      setNewCategoryColor('#000000');
    } catch (error) {
      console.error('Error creating category:', error.response ? error.response.data : error.message);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${baseUrl}/categories/${categoryId}/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setCategories(categories.filter(category => category.id !== categoryId));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Manage Categories</h2>
      <form onSubmit={handleCreateCategory} className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="New category name"
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <div className="relative">
            <input
              type="color"
              value={newCategoryColor}
              onChange={(e) => setNewCategoryColor(e.target.value)}
              className="absolute inset-0 opacity-0 w-10 h-10 cursor-pointer"
            />
            <div 
              className="w-10 h-10 rounded-full border-2 border-gray-300 cursor-pointer"
              style={{ backgroundColor: newCategoryColor }}
            ></div>
          </div>
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
        >
          Create Category
        </button>
      </form>
      <ul className="space-y-3">
        {categories.map(category => (
          <li key={category.id} className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
            <div className="flex items-center space-x-3">
              <div 
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: category.color }}
              ></div>
              <span className="text-gray-800 dark:text-white font-medium">
                {category.name}
              </span>
            </div>
            <button 
              onClick={() => handleDeleteCategory(category.id)}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm transition duration-300"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryManager;