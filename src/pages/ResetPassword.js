import React, { useEffect, useState } from "react";
import {Link, useLocation} from "react-router-dom";
import AuthService from "../services/auth.service";
import Input from "react-validation/build/input";
import Form from "react-validation/build/form";

const ResetPassword = () => {
    const currentUser = AuthService.getCurrentUser();
    const currentLocation = useLocation();
    const [newPassword, setNewPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const token = new URLSearchParams(currentLocation.search).get("token");

    if (!currentUser && !token) {
        return (
            <div className="container">
                <p>You must be <Link to="/login">logged in</Link> or have a <Link to="/auth/forgotPassword">password reset</Link> link
                    to view this page.</p>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const response = await AuthService.resetPassword(newPassword, oldPassword, token);

            if (response.status === 200) {
                setMessage("Password reset successfully!");
            }
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="col-md-12">
            {loading ? (
                <div className="form-group">
                    <div className="spinner-border text-primary" role="status"></div>
                    <div>{message}</div>
                </div>
            ) : (
                <Form onSubmit={handleSubmit}>
                    {!token && (
                        <div className="form-group">
                            <label htmlFor="oldPassword">Old Password:</label>
                            <Input
                                type="password"
                                id="oldPassword"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="newPassword">New Password:</label>
                        <Input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Reset Password</button>
                </Form>
            )}
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
        </div>
    );
};

export default ResetPassword;
