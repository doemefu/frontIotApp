import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import AuthService from "../../services/auth.service";

const fetchAllUsers = async () => {
    try {
        const response = await api.get("/user-management/allUsers");
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }

};

const ShowUsers = () => {
    const currentUser = AuthService.getCurrentUser();

    const [users, setUsers] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

    useEffect(() => {
        const fetchData = async () => {
            const fetchedUsers = await fetchAllUsers();
            setUsers(fetchedUsers);
        };

        fetchData();
    }, []);

    const sortedUsers = [...users].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortSymbol = (key) => {
        return sortConfig.key === key ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '';
    };

    if (!currentUser || !currentUser.roles.includes("ROLE_ADMIN")) {
        return (
            <div className="container">
                <p>You must be <Link to="/login">logged in</Link> to view this page.</p>
            </div>
        );
    }

    return (
        <div className="container">
            <header className="jumbotron">
                <h3>Show Users</h3>
            </header>
            <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                <tr>
                    <th onClick={() => requestSort('id')}>ID {getSortSymbol('id')}</th>
                    <th onClick={() => requestSort('username')}>Username {getSortSymbol('username')}</th>
                    <th onClick={() => requestSort('email')}>Email {getSortSymbol('email')}</th>
                    <th onClick={() => requestSort('password')}>Password {getSortSymbol('password')}</th>
                    <th onClick={() => requestSort('roles')}>Roles {getSortSymbol('roles')}</th>
                    <th onClick={() => requestSort('userStatus')}>User Status {getSortSymbol('userStatus')}</th>
                    <th onClick={() => requestSort('createdAt')}>Created At {getSortSymbol('createdAt')}</th>
                    <th onClick={() => requestSort('changedAt')}>Changed At {getSortSymbol('changedAt')}</th>
                </tr>
                </thead>
                <tbody>
                {sortedUsers.map((user) => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.password}</td>
                        <td>{user.roles.map(role => role.name).join(', ')}</td>
                        <td>{user.userStatus.name}</td>
                        <td>{new Date(user.createdAt).toLocaleString()}</td>
                        <td>{new Date(user.changedAt).toLocaleString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ShowUsers;