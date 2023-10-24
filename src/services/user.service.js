import api from "./api";

const getPublicContent = () => {
    return api.get("/get/all");
};

const getUserBoard = () => {
    return api.get("/get/user");
};

const getModeratorBoard = () => {
    return api.get("/get/mod");
};

const getAdminBoard = () => {
    return api.get("/get/admin");
};

const UserService = {
    getPublicContent,
    getUserBoard,
    getModeratorBoard,
    getAdminBoard,
}

export default UserService;