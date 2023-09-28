import React from "react";
import AuthService from "../../services/auth.service";
import {Link} from "react-router-dom";

const DataView = () => {
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
                    <strong>Influx Data will be shown here</strong>
                </h3>
            </header>
            <p>
                Bli bla blub
            </p>
        </div>
    );
};

export default DataView;