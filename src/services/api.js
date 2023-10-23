import axios from "axios";
import TokenService from "./token.service";

const instance = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

instance.interceptors.request.use(
    (config) => {
        console.log("instance.interceptors.request.use fullfilled");
        const token = TokenService.getLocalAccessToken();
        if (token) {
            console.log("instance.interceptors.request.use fullfilled with token");
            config.headers["Authorization"] = 'Bearer ' + token;
        }else {
        console.log("instance.interceptors.request.use fullfilled without token");
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
        return response;
    },
    async (error) => {
        const originalConfig = error.config;

        if (originalConfig.url !== "/auth/login" && error.response) {
            // Access Token was expired
            if (error.response.status === 401 && !originalConfig._retry) {
                originalConfig._retry = true;

                try {
                    const axiosResponse = await instance.post("/auth/refreshtoken", {
                        refreshToken: TokenService.getLocalRefreshToken(),
                    });

                    const { newAccessToken } = axiosResponse.data;
                    TokenService.updateLocalAccessToken(newAccessToken);

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