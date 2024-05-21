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
            //if (response.data.accessToken) { //non Cookie variant
            if (response.data) { //Cookie variant
                TokenService.setUser(response.data);
            }
            return response.data;
        });
};

const verifyEmail = (token) => {
    return api
        .post("/auth/verifyEmail", {
            token
        })
        .then((response) => {
            console.log("Verify Email Response:", response);
            return response.data;
        });
}

const forgotPassword = (email) => {
    return api
        .post("/user-management/forgotPassword", {
            email
        })
        .then((response) => {
            console.log("forgotPassword Response:", response);
            return response;
        });
}

const resetPassword = (newPassword, oldPassword, token) => {
    const payload = {
        newPassword,
    };

    if (token) {
        payload.token = token;
    } else {
        payload.oldPassword = oldPassword;
    }

    return api
        .post("/user-management/resetPassword", payload)
        .then((response) => {
            console.log("Reset Password Response:", response);
            return response;
        })
        .catch((error) => {
            console.error("Reset Password Error:", error);
            throw error;
        });
};

const logout = () => {
    return api
        .post("/auth/logout")
        .then((response) => {
            console.log("Logout Response:", response);
            TokenService.removeUser();
        })
        .catch((error) => {
            console.error("Logout Error:", error);
        });
};

const getCurrentUser = () => {
    return TokenService.getUser();
};

const AuthService = {
    register,
    login,
    verifyEmail,
    forgotPassword,
    resetPassword,
    logout,
    getCurrentUser,
}

export default AuthService;