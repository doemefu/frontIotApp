import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/App.css";

import AuthService from "./services/auth.service";
import EventBus from "./utils/EventBus";

import Home from "./pages/home/index";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Profile from "./pages/Profile";

import HeaderUser from "./components/header/HeaderUser";
import HeaderModerator from "./components/header/HeaderMod";
import HeaderAdmin from "./components/header/HeaderAdmin";
import DataView from "./pages/dataView/DataView";
import EmailVerification from "./pages/EmailVerification";
import {Dropdown} from "react-bootstrap";
import ShowUsers from "./components/usermanagement/showUsers";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import { useMediaQuery } from 'react-responsive';

const App = () => {
    const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 1224px)' });
    const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 });
    const [showModeratorBoard, setShowModeratorBoard] = useState(false);
    const [showAdminBoard, setShowAdminBoard] = useState(false);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const logOut = () => {
        AuthService.logout();
        setShowModeratorBoard(false);
        setShowAdminBoard(false);
        setCurrentUser(undefined);
    };

    // For mounting and initial setting
    useEffect(() => {
        const user = AuthService.getCurrentUser();

        if (user) {
            setCurrentUser(user);
            setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
            setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
        } else {
            setCurrentUser(undefined);
            setShowModeratorBoard(false);
            setShowAdminBoard(false);
        }

        EventBus.on("logout", () => {
            logOut();
        });

        return () => {
            EventBus.remove("logout");
        };
    }, []);

    // For reacting to currentUser changes
    useEffect(() => {
        if (currentUser) {
            setShowModeratorBoard(currentUser.roles.includes("ROLE_MODERATOR"));
            setShowAdminBoard(currentUser.roles.includes("ROLE_ADMIN"));
        }
    }, [currentUser]);

    return (
        <div>
            {isDesktopOrLaptop && (
                <div>
                    {/* Desktop-Ansicht */}
                    <nav className="navbar navbar-expand navbar-dark bg-dark">
                        <Link to={"/"} className="navbar-brand">
                            IoT-App
                        </Link>
                        <div className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <Link to={"/home"} className="nav-link">
                                    Home
                                </Link>
                            </li>

                            {showModeratorBoard && (
                                <li className="nav-item">
                                    <Link to={"/mod"} className="nav-link">
                                        Moderator Board
                                    </Link>
                                </li>
                            )}

                            {showAdminBoard && (
                                <li className="nav-item dropdown">
                                    <Dropdown>
                                        <Dropdown.Toggle variant="success" href="#" id="dropdown-basic">
                                            Admin Stuff
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item href="/admin/showUsers">showUsers</Dropdown.Item>
                                            <Dropdown.Item href="/admin/showRoles">Another action</Dropdown.Item>
                                            <Dropdown.Item href="/admin/forgotPassword">Something else</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </li>
                            )}

                            {currentUser && (
                                <li className="nav-item">
                                    <Link to={"/user"} className="nav-link">
                                        User
                                    </Link>
                                </li>
                            )}
                        </div>

                        {currentUser ? (
                            <div className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    <Link to={"/dataView"} className="nav-link">
                                        Data View
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to={"/profile"} className="nav-link">
                                        {currentUser.username}
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" onClick={logOut} to={"/home"}>
                                        LogOut
                                    </Link>
                                </li>
                            </div>
                        ) : (
                            <div className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    <Link to={"/login"} className="nav-link">
                                        Login
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link to={"/register"} className="nav-link">
                                        Register
                                    </Link>
                                </li>
                            </div>
                        )}
                    </nav>
                    <div className="container mt-3">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/home" element={<Home />} />
                            <Route path="/index" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/user" element={<HeaderUser />} />
                            <Route path="/mod" element={<HeaderModerator />} />
                            <Route path="/admin" element={<HeaderAdmin />} />
                            <Route path="/dataView" element={<DataView />} />
                        </Routes>
                    </div>

                </div>
            )}

            {isTabletOrMobile && (
                <div className="navbar navbar-expand navbar-dark bg-dark">
                    <Link to={"/"} className="navbar-brand">
                        IoT-App
                    </Link>
                    <div>
                        <img src="assets/hamburger.png" alt="hamburger icon" width="40" height="40" className="mobile-nav-icon" onClick={() => setMobileNavOpen(!mobileNavOpen)}></img>
                    </div>
                    {mobileNavOpen && (
                        <div className="mobile-nav-menu-active">
                            <Link to={"/home"} className="nav-link">
                                Home
                            </Link>
                            {showModeratorBoard && (
                                <Link to={"/mod"} className="nav-link">
                                    Moderator Board
                                </Link>
                            )}
                            {showAdminBoard && (
                                <Link to={"/admin"} className="nav-link">
                                    Admin Board
                                </Link>
                            )}
                            {currentUser && (
                                <Link to={"/user"} className="nav-link">
                                    User
                                </Link>
                            )}
                            {currentUser && (
                                <Link to={"/dataView"} className="nav-link">
                                    Data View
                                </Link>
                            )}
                            {currentUser && (
                                <Link to={"/profile"} className="nav-link">
                                    {currentUser.username}
                                </Link>
                            )}
                            {currentUser ? (
                                <Link className="nav-link" onClick={logOut} to={"/home"}>
                                    LogOut
                                </Link>
                            ) : (
                                <Link to={"/login"} className="nav-link">
                                    Login
                                </Link>
                            )}
                            {currentUser ? (
                                <Link className="nav-link" onClick={logOut} to={"/home"}>
                                    LogOut
                                </Link>
                            ) : (
                                <Link to={"/register"} className="nav-link">
                                    Register
                                </Link>
                            )}
                        </div>
                    )}
                </div>


            )}
            <div className="container mt-3">
                <Routes>
                    <Route path="*" element={<Home/>}/>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/index" element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/user" element={<HeaderUser/>}/>
                    <Route path="/mod" element={<HeaderModerator/>}/>
                    <Route path="/admin" element={<HeaderAdmin/>}/>
                    <Route path="/dataView" element={<DataView/>}/>
                    <Route path="/admin/showUsers" element={<ShowUsers/>}/>
                    <Route path="/admin/showRoles" element={<DataView/>}/>
                    <Route path="/auth/verifyEmail" element={<EmailVerification/>}/>
                    <Route path="/auth/forgotPassword" element={<ForgotPassword/>}/>
                    <Route path="/auth/resetPassword" element={<ResetPassword/>}/>
                    <Route path="/auth/resetPassword" element={<DataView/>}/>
                </Routes>
            </div>
        </div>
    );
};

export default App;
