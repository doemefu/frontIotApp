import React, { useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import AuthService from "../services/auth.service";  // Import if you're using React Router

const EmailVerification = ({ location }) => {
    const routerLocation = useLocation();  // Use if you're using React Router

    useEffect(() => {
        const currentLocation = location || routerLocation;  // Fallback to routerLocation if location is undefined
        if (currentLocation && currentLocation.search) {
            const token = new URLSearchParams(currentLocation.search).get('token');
            if (token) {
                AuthService.verifyEmail(token).then(
                    (data) => {
                        //comment out for debugging
                        console.log("Received data:", data);
                    },
                    (error) => {
                        let resMessage = "Lokaler Fehler";

                        resMessage =
                            (error.response
                                && error.response.data
                                && error.response.data.message)
                            || error.message
                            || error.toString();

                        //setMessage(resMessage);
                        //setLoading(false);
                        console.log(resMessage);
                    }
                );
            }
        }
    }, [location, routerLocation]);  // Add routerLocation to dependency array if using React Router

    return (
        <div>
            {/* Your UI here */}
        </div>
    );
};

export default EmailVerification;