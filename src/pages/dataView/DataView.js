import React, { useEffect, useState } from "react";
import AuthService from "../../services/auth.service";
import { Link } from "react-router-dom";
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import api from "../../services/api";

const DataView = () => {
    const currentUser = AuthService.getCurrentUser();
    const [data, setData] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState('both');

    useEffect(() => {
        if (currentUser) {
            api
                .get('data/influxDataNew', {})
                .then(res => {
                    const preprocessedData = res.data.map(entry => ({
                        value: entry._value,
                        time: new Date(entry._time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        field: entry._field,
                        device: entry.device
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
    const terra1HumidityData = data.filter(d => d.field === 'Humidity' && d.device === 'terra1');
    const terra1TemperatureData = data.filter(d => d.field === 'Temperature' && d.device === 'terra1');
    const terra2HumidityData = data.filter(d => d.field === 'Humidity' && d.device === 'terra2');
    const terra2TemperatureData = data.filter(d => d.field === 'Temperature' && d.device === 'terra2');


    return (
        <div className="container">
            <header className="jumbotron">
                <h3>
                    <strong>Influx Data will be shown here</strong>
                </h3>
            </header>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart width={1200} height={300} margin={{top: 5, right: 20, bottom: 5, left: 0}}>
                    { (selectedDevice === 'terra1' || selectedDevice === 'both') && (
                        <>
                            <Line type="monotone" dataKey="value" data={terra1HumidityData} stroke="#8884d8" name="Terra1 Humidity" />
                            <Line type="monotone" dataKey="value" data={terra1TemperatureData} stroke="#82ca9d" name="Terra1 Temperature" />
                        </>
                    )}
                    { (selectedDevice === 'terra2' || selectedDevice === 'both') && (
                        <>
                            <Line type="monotone" dataKey="value" data={terra2HumidityData} stroke="#ffc658" name="Terra2 Humidity" />
                            <Line type="monotone" dataKey="value" data={terra2TemperatureData} stroke="#ff7300" name="Terra2 Temperature" />
                        </>
                    )}
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
                    <YAxis dataKey="value"/>
                    <XAxis dataKey="time" type={"category"} allowDuplicatedCategory={false} interval={4}/>
                    <Legend/>
                    <Tooltip/>
                </LineChart>
            </ResponsiveContainer>
            <div>
                <input
                    type="radio"
                    value="terra1"
                    checked={selectedDevice === 'terra1'}
                    onChange={(e) => setSelectedDevice(e.target.value)}
                /> Terra1
                <input
                    type="radio"
                    value="terra2"
                    checked={selectedDevice === 'terra2'}
                    onChange={(e) => setSelectedDevice(e.target.value)}
                /> Terra2
                <input
                    type="radio"
                    value="both"
                    checked={selectedDevice === 'both'}
                    onChange={(e) => setSelectedDevice(e.target.value)}
                /> Beide
            </div>
        </div>
    );
};

export default DataView;