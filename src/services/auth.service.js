import TokenService from "./token.service";
import api from "./api";

const register = (username, email, password) =>{
    return api.post("/auth/register", {
        username,
        email,
        password
    });
}

const login = (username, password) => {
    return api
        .post("/auth/login", {
            username,
            password,
        })
        .then((response) => {
            if (response.data.accessToken) {
                TokenService.setUser(response.data);
            }
            return response.data;
        });
};

const logout = () => {
    TokenService.removeUser();
    return api
        .post("/auth/logout")
        .then((response) => {
            return response.data;
        });
};

const getCurrentUser = () => {
    return TokenService.getUser();
};

const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
}

export default AuthService;