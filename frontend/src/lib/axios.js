import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api/v1', // Your backend URL
    withCredentials: true // Crucial for handling cookies
});

export default apiClient;