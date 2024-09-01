import axios from 'axios';

// Create an instance of Axios with custom configuration
const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000', // Your backend server URL
    timeout: 10000, // Request timeout in milliseconds
    headers: {
        'Content-Type': 'application/json', // Default content type
        // Add any other headers as needed
    },
});

export default axiosInstance;
