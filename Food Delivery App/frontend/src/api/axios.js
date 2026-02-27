import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Debugging: Check the browser console to see if the correct URL is loaded
console.log("Current API Base URL:", baseURL);

const API = axios.create({
    baseURL: baseURL,
});

// Add a request interceptor to include the JWT token
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default API;
