import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:3004',

    withCredentials: true,
});

