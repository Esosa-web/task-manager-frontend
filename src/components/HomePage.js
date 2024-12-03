import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <h1 className="text-5xl font-bold text-center text-gray-900 dark:text-white mb-8">
        Welcome to TaskMaster
      </h1>
      <p className="text-xl text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl">
        Organize your tasks, boost your productivity, and take control of your day with TaskMaster - your personal task management solution.
      </p>
      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <Link
          to="/tasks"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 text-center"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 text-center"
        >
          Login
        </Link>
      </div>
    </div>
  );
}

export default HomePage;