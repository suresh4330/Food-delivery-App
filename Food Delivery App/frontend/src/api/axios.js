import axios from 'axios';

// Get the API URL from env, remove trailing slash if present, or fallback to localhost
const envURL = import.meta.env.VITE_API_URL;
const baseURL = envURL ? envURL.replace(/\/$/, '') : 'http://localhost:5000/api';

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
