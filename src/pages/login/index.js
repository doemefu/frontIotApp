import React, {useState} from "react";

//import "./Login.css";

export default function Login() {
    const [loginFormData, setLoginFormData] = useState({
        username: '',
        password: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginFormData({
            ...loginFormData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loginResponse = await fetch("http://localhost:8080/login", {
            method: "POST",
            mode: 'cors',
            headers: {
               // 'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginFormData)
        });
        console.log(loginFormData.username);
        console.log(loginResponse.status, loginResponse.statusText, loginResponse.body);
        if (loginResponse.status === 200) {
            console.log("Login successful");
        } else {
            console.log("Login failed");
        }

    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={loginFormData.username}
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
                        value={loginFormData.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}