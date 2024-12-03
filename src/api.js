import axios from 'axios';
import { baseUrl } from './config';  // Add this import

export const fetchTasks = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${baseUrl}/tasks/`, {
      headers: { Authorization: `Token ${token}` }
    });
    console.log('Tasks response:', response.data);  // Add this line
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};