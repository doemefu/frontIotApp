import React, { useEffect, useState } from "react";
import AuthService from "../../services/auth.service";
import { Link } from "react-router-dom";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from "../../services/api";

const NewDataView = () => {
    const currentUser = AuthService.getCurrentUser();
    const [data, setData] = useState([]);
    const [selectedDevices, setSelectedDevices] = useState([]);
    const [selectedDataTypes, setSelectedDataTypes] = useState([]);

    useEffect(() => {
        if (currentUser) {
            api
                .get('data/influxDataNew', {})
                .then(res => {
                    const preprocessedData = res.data.map(entry => ({
                        value: roundToOneDecimal(entry._value),
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

    const roundToOneDecimal = (num) => {
        return Math.round(num * 10) / 10;
    };

    const filteredData = data.filter(d => selectedDevices.includes(d.device) && selectedDataTypes.includes(d.field));

    const handleDeviceChange = (device) => {
        setSelectedDevices(prevDevices =>
            prevDevices.includes(device) ? prevDevices.filter(d => d !== device) : [...prevDevices, device]
        );
    };

    const handleDataTypeChange = (dataType) => {
        setSelectedDataTypes(prevDataTypes =>
            prevDataTypes.includes(dataType) ? prevDataTypes.filter(dt => dt !== dataType) : [...prevDataTypes, dataType]
        );
    };

    const getYDomain = (data) => {
        if (data.length === 0) return [0, 1];
        const values = data.map(d => d.value);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const padding = (max - min) * 0.2;
        return [roundToOneDecimal(min - padding), roundToOneDecimal(max + padding)];
    };

    const yDomain = getYDomain(filteredData);

    const colors = {
        'terra1': '#8884d8',
        'terra2': '#82ca9d',
        'Humidity': '#ffc658',
        'Temperature': '#ff7300'
    };

    return (
        <div className="container">
            <header className="jumbotron">
                <h3><strong>Influx Data will be shown here</strong></h3>
            </header>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart width={1200} height={300} data={filteredData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    {selectedDataTypes.map((dataType, index) =>
                        selectedDevices.map((device, deviceIndex) => (
                            <Line
                                key={`${device}-${dataType}-${deviceIndex}`}
                                type="monotone"
                                dataKey="value"
                                data={data.filter(d => d.device === device && d.field === dataType)}
                                stroke={colors[device] || colors[dataType]}
                                name={`${device} ${dataType}`}
                            />
                        ))
                    )}
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <YAxis dataKey="value" domain={yDomain} />
                    <XAxis dataKey="time" type={"category"} allowDuplicatedCategory={false} interval={4} />
                    <Legend formatter={(value, entry) => {
                        if (value.includes('Humidity')) return `${value} (%rh)`;
                        if (value.includes('Temperature')) return `${value} (°C)`;
                        return value;
                    }} />
                    <Tooltip formatter={(value) => roundToOneDecimal(value)} />
                </LineChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '20px' }}>
                <div>
                    <h4>Terrarium</h4>
                    <label>
                        <input
                            type="checkbox"
                            value="terra1"
                            checked={selectedDevices.includes('terra1')}
                            onChange={() => handleDeviceChange('terra1')}
                        /> <span style={{ color: colors['terra1'] }}>Terra1</span>
                    </label>
                    <br />
                    <label>
                        <input
                            type="checkbox"
                            value="terra2"
                            checked={selectedDevices.includes('terra2')}
                            onChange={() => handleDeviceChange('terra2')}
                        /> <span style={{ color: colors['terra2'] }}>Terra2</span>
                    </label>
                </div>
                <div style={{ marginLeft: '20px' }}>
                    <h4>Data Types</h4>
                    <label>
                        <input
                            type="checkbox"
                            value="Humidity"
                            checked={selectedDataTypes.includes('Humidity')}
                            onChange={() => handleDataTypeChange('Humidity')}
                        /> <span style={{ color: colors['Humidity'] }}>Humidity</span>
                    </label>
                    <br />
                    <label>
                        <input
                            type="checkbox"
                            value="Temperature"
                            checked={selectedDataTypes.includes('Temperature')}
                            onChange={() => handleDataTypeChange('Temperature')}
                        /> <span style={{ color: colors['Temperature'] }}>Temperature</span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default NewDataView;