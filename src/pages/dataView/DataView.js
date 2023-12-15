import React, { useEffect, useState } from "react";
import AuthService from "../../services/auth.service";
import { Link } from "react-router-dom";
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import api from "../../services/api";

const DataView = () => {
    const currentUser = AuthService.getCurrentUser();
    const [data, setData] = useState([]);

    useEffect(() => {
        if (currentUser) {
            //axios.get('https://furchert.ch/api/data/influxData', {
            //axios.get('https://iot-app-backend.azurewebsites.net/api/data/influxData', {
            api
                .get('data/influxData', {
                //headers: {
                //    'Authorization': `Bearer ${currentUser.accessToken}`
                //}
                })
                .then(res => {
                    const preprocessedData = res.data.map(entry => ({
                        value: entry.value,
                        time: new Date(entry.time).toLocaleTimeString(), // You can format this as needed
                        field: entry.field,
                    }));
                    setData(preprocessedData);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }, []);

    if (!currentUser) {
        return (
            <div className="container">
                <p>You must be <Link to="/login">logged in</Link> to view this page.</p>
            </div>
        );
    }
    const humidityData = data.filter(d => d.field === 'Humidity');
    const temperatureData = data.filter(d => d.field === 'Temperature');

    return (
        <div className="container">
            <header className="jumbotron">
                <h3>
                    <strong>Influx Data will be shown here</strong>
                </h3>
            </header>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart width={1200} height={300} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <Line type="monotone" dataKey="value" data={humidityData} stroke="#8884d8" name="Humidity" />
                    <Line type="monotone" dataKey="value" data={temperatureData} stroke="#82ca9d" name="Temperature" />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <YAxis dataKey="value" />
                    <XAxis dataKey="time" type={"category"} allowDuplicatedCategory={false} interval={4}/>
                    <Legend />
                    <Tooltip />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DataView;