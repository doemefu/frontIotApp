import axios from "axios";
import Cookies from "js-cookie";
import AuthService from "./auth.service"; // Import the js-cookie library

const instance = axios.create({
    baseURL: "https://furchert.ch/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Ensure cookies are sent with requests
    xsrfCookieName: 'XSRF-TOKEN', // default
    xsrfHeaderName: 'X-XSRF-TOKEN', // default
});

instance.interceptors.request.use(
    (config) => {
        /*
        if(config.method !== "GET") {
            // Retrieve the CSRF token from cookies
            const csrfToken = Cookies.get('XSRF-TOKEN'); // Default cookie name used by Spring Security
            if (csrfToken) {
                config.headers["X-XSRF-TOKEN"] = csrfToken;
            }
        }
         */
        return config;
    },
    (error) => {
        console.log("instance.interceptors.request.use rejected");
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        // Successful response processing
        console.log("Interceptor success: ", response);
        return response;
    },
    async (error) => {
        const originalConfig = error.config;
        console.log("Interceptor error handling");

        // Check if it's a login or logout failure and retry once
        if ((originalConfig.url.includes("/auth/login") || originalConfig.url.includes("/auth/logout")) && !originalConfig._retry) {
            console.log("Login or Logout request failed, retrying once");
            originalConfig._retry = true;  // Flag to prevent further retry attempts
            try {
                // Directly retry the request without modifying the original request data
                return instance(originalConfig);
            } catch (_error) {
                console.log("Second attempt failed for Login/Logout");
                return Promise.reject(_error);
            }
        }

        // Directly handling failed attempts to refresh the token
        if (originalConfig.url === "/auth/refreshtoken") {
            console.log("Refresh token request failed, logging out");
            await AuthService.logout();
            return Promise.reject(error);
        }

        // Handling expired access tokens
        if (!originalConfig.url.includes("/auth/login") && !originalConfig.url.includes("/auth/logout") && error.response.status === 401 && !originalConfig._retry) {
            console.log("Access token expired, attempting to refresh");
            originalConfig._retry = true;
            try {
                const axiosResponse = await instance.post("/auth/refreshtoken");
                if (axiosResponse.status === 200) {
                    console.log("Token refreshed successfully, retrying original request");
                    return instance(originalConfig);
                }
            } catch (_error) {
                console.log("Failed to refresh token, logging out");
                await AuthService.logout();
                return Promise.reject(_error);
            }
        }

        return Promise.reject(error);
    }
);

export default instance;