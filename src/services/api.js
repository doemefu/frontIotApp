import axios from "axios";
import TokenService from "./token.service";

const instance = axios.create({
    baseURL: "https://furchert.ch/api",
    //baseURL: "http://backend:8080/api",
    //baseURL: "https://iot-app-backend.azurewebsites.net/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

instance.interceptors.request.use(
    (config) => {
        /*
        const token = TokenService.getLocalAccessToken();
        if (token) {
            console.log("instance.interceptors.request.use fullfilled with token");
            config.headers["Authorization"] = 'Bearer ' + token;
        }else {
        console.log("instance.interceptors.request.use fullfilled without token");
        }*/

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

                    //const { accessToken } = axiosResponse.data;
                    //TokenService.updateLocalAccessToken(accessToken);

                    return instance(originalConfig);
                } catch (_error) {
                    return Promise.reject(_error);
                }
            }
        }
        return Promise.reject(error);
    }
);

export default instance;