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
            //console.log("Login Response:", response);
            //if (response.data.username) {
            if (response.data.accessToken) {
                TokenService.setUser(response.data);
            }
            return response.data;
        });
};

const logout = () => {
    //merkürdig
    api
        .post("/auth/logout")
        .then((response) => {
            console.log("Logout Response:", response);
            //return response.data;
            //await response
            TokenService.removeUser();
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