import React from "react";
import AuthService from "../services/auth.service";
import { Link } from "react-router-dom";
import DeviceStatusBlock from "../components/DeviceStatus";

const StatusView = () => {
    const currentUser = AuthService.getCurrentUser();

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
                <h3><strong>Device states will be shown here</strong></h3>
            </header>
            <DeviceStatusBlock deviceName="Terra 1"/>
            <DeviceStatusBlock deviceName="Terra 2"/>
            <DeviceStatusBlock deviceName="Java Backend"/>
        </div>
    );
};

export default StatusView;
