import AuthService from "../services/auth.service";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ResetPassword = () => {
    const currentUser = AuthService.getCurrentUser();
    const currentLocation = useLocation();

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const token = new URLSearchParams(currentLocation.search).get('token');

    useEffect(() => {
        if (token) {
            // Handle reset password with token (Forgot Password flow)
            // You can call an API to validate the token here
        } else if (currentUser) {
            // Handle reset password for logged-in user (User Settings flow)
            // You can pre-fill some form fields if needed
        } else {
            // Handle invalid access, maybe redirect to login or show an error message
        }
    }, [token, currentUser]);

    return (
        <div className="col-md-12">
            {loading ? (
                <div className="form-group">
                    <div className="spinner-border text-primary" role="status"></div>
                    <div>{message}</div>
                </div>
            ) : (
                <div>
                    {/* Your reset password form here */}
                    {token && <div>Reset password using token: {token}</div>}
                    {currentUser && <div>Reset password for user: {currentUser.username}</div>}
                </div>
            )}
        </div>
    );
};

export default ResetPassword;
