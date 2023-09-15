import React, {useState} from "react";

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
//        verifyPassword: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:8080/register", {
            method: "POST",
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        console.log(formData.username);
        console.log(response.status, response.statusText, response.body);
        if (response.status === 200) {
            console.log("Registration successful");
        } else {
            console.log("Registration failed");
        }
    };

    return (
        <div>
            <h1>Registration</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                {/*
                <div>
                    <label htmlFor="verifyPassword">verify Password:</label>
                    <input
                        type="password"
                        id="verifyPassword"
                        name="verifyPassword"
                        value={formData.verifyPassword}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                */}
                <button type="submit">Register</button>
            </form>
        </div>
    );
}