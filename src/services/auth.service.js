import TokenService from "./token.service";
import api from "./api";

const login = (username, password) => {
    return api
        .post("/auth/login", {
            username,
            password,
        })
        .then((response) => {
            if (response.data) { // Ensure data exists
                TokenService.setUser(response.data);
            }
            return response.data;
        })
        .catch((error) => {
            console.error("Login error:", error);
            throw error;
        });
};

const logout = () => {
    return api
        .post("/auth/logout")
        .then((response) => {
            console.log("Logout Response:", response);
            TokenService.removeUser();
            window.location.href = "/login"; // Redirect to login page
        })
        .catch((error) => {
            console.error("Logout Error:", error);
        });
};

const AuthService = {
    login,
    logout,
    // other methods...
};

export default AuthService;
