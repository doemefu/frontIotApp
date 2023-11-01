import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import AuthService from "../services/auth.service";

const EmailVerification = ({ location }) => {
    const routerLocation = useLocation();

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const currentLocation = location || routerLocation;  // Fallback to routerLocation if location is undefined
        if (currentLocation && currentLocation.search) {
            setLoading(true);
            const token = new URLSearchParams(currentLocation.search).get('token');
            if (token) {
                AuthService.verifyEmail(token).then(
                    (data) => {
                        setLoading(false);
                        setMessage("Verification successful");
                        console.log("Received data:", data);
                    },
                    (error) => {
                        setLoading(false);
                        let resMessage = "Lokaler Fehler";
                        resMessage =
                            (error.response
                                && error.response.data
                                && error.response.data.message)
                            || error.message
                            || error.toString();

                        setMessage(resMessage);
                        console.log(resMessage);
                    }
                );
            } else {
                setLoading(false);
                setMessage("Token is not available");
            }
        }
    }, [location, routerLocation]);

    return (
        <div className="col-md-12">
            {loading ? (
                <div className="form-group">
                    <div className="spinner-border text-primary" role="status"></div>
                    <div>{message}</div>
                </div>
            ) : (
                <div>
                    <div className="form-group">
                        <div className={message === "Verification successful" ? "alert alert-success" : "alert alert-danger"} role="alert">
                            {message}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmailVerification;