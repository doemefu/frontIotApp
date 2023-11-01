import React from "react";
import AuthService from "../services/auth.service";
import { Link } from "react-router-dom";

const Profile = () => {
    const currentUser = AuthService.getCurrentUser();

    // Null check for currentUser
    if (!currentUser) {
        return (
            <div className="container">
                <p>You must be <Link to="/login">logged in</Link> to view this page.</p>
            </div>
        );
    }

    return (
        <div className="container">
            <header className="jumbotron">
                <h3>
                    <strong>{currentUser.username}</strong> Profile
                </h3>
            </header>
            <p>
                <strong>Token:</strong> {currentUser.accessToken.substring(0, 20)} ...{" "}
                {currentUser.accessToken.substring(currentUser.accessToken.length - 20)}
            </p>
            <p>
                <strong>Refresh-Token:</strong> {currentUser.refreshToken}
            </p>
            <p>
                <strong>Id:</strong> {currentUser.id}
            </p>
            <p>
                <strong>Email:</strong> {currentUser.email}
            </p>
            <p>
                <strong>User Status:</strong> {currentUser.userStatus ? currentUser.userStatus : "N/A"}
            </p>
            <p>
                <strong>Created At:</strong> {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleString() : "N/A"}
            </p>
            <p>
                <strong>Changed At:</strong> {currentUser.changedAt ? new Date(currentUser.changedAt).toLocaleString() : "N/A"}
            </p>
            <strong>Authorities:</strong>
            <ul>
                {currentUser.roles &&
                    currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
            </ul>
            <div className="forgot-password">
                <Link to="/auth/resetPassword">Reset Password?</Link>
            </div>
        </div>
    );
};

export default Profile;
