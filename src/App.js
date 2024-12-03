import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import Login from './components/Login';
import TaskManager from './components/TaskManager';
import CategoryManager from './components/CategoryManager';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    
    const savedDarkMode = localStorage.getItem('darkMode');
    setDarkMode(savedDarkMode === 'true');
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <button
          onClick={toggleDarkMode}
          className="fixed bottom-4 right-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white p-2 rounded-full transition-colors duration-300 shadow-lg"
          aria-label="Toggle dark mode"
        >
          {darkMode ? '🌞' : '🌙'}
        </button>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/login"
              element={isLoggedIn ? <Navigate to="/tasks" replace /> : <Login onLoginSuccess={handleLoginSuccess} />}
            />
            <Route
              path="/tasks"
              element={isLoggedIn ? <TaskManager /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/categories"
              element={isLoggedIn ? <CategoryManager /> : <Navigate to="/login" replace />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;