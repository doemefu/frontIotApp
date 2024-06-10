import axios from "axios";
import Cookies from "js-cookie";
import AuthService from "./auth.service"; // Import the js-cookie library

const instance = axios.create({
    baseURL: "https://furchert.ch/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Ensure cookies are sent with requests
});

instance.interceptors.request.use(
    (config) => {
        // Retrieve the CSRF token from cookies
        const csrfToken = Cookies.get('XSRF-TOKEN'); // Default cookie name used by Spring Security
        if (csrfToken) {
            config.headers["X-XSRF-TOKEN"] = csrfToken;
        }
        return config;
    },
    (error) => {
        console.log("instance.interceptors.request.use rejected");
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        console.log("interceptor 1: " + response);
        return response;
    },
    async (error) => {
        const originalConfig = error.config;
        console.log("interceptor 2");
        if (originalConfig.url !== "/auth/login" && error.response) {
            // Access Token was expired
            if (error.response.status === 401 && !originalConfig._retry) {
                originalConfig._retry = true;

                try {
                    const axiosResponse = await instance.post("/auth/refreshtoken", {
                        //refreshToken: TokenService.getLocalRefreshToken(),
                    });

                    if (axiosResponse.status === 200) {
                        // Handle the new access token here if necessary
                        return instance(originalConfig);
                    } else {
                        // Logout user if refresh token request is unsuccessful
                        AuthService.logout();
                        return Promise.reject(error);
                    }
                } catch (_error) {
                    // Logout user if refresh token request throws an error
                    AuthService.logout();
                    return Promise.reject(_error);
                }
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
