import React, { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import '../styles.css';

const TerrariumDashboard = () => {
    const [terrarium1, setTerrarium1] = useState({processing: {}});
    const [terrarium2, setTerrarium2] = useState({processing: {}});
    const clientRef = useRef(null); // Verwendung eines Refs für dauerhafte Referenzen

    useEffect(() => {
        const socket = new SockJS('https://furchert.ch/api/ws');
        clientRef.current = new Client({
            webSocketFactory: () => socket,
            debug: function (str) {
                console.log(str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        clientRef.current.onConnect = () => {
            clientRef.current.subscribe('/topic/terrarium/terra1', message => {
                setTerrarium1({...JSON.parse(message.body), processing: {}});
            });
            clientRef.current.subscribe('/topic/terrarium/terra2', message => {
                setTerrarium2({...JSON.parse(message.body), processing: {}});
            });

            clientRef.current.publish({destination: '/app/requestData', body: 'terra1'});
            clientRef.current.publish({destination: '/app/requestData', body: 'terra2'});
        };

        clientRef.current.activate();

        return () => {
            clientRef.current.deactivate();
        };
    }, []);

    const handleToggle = (terrariumId, field) => {
        // Determine which terrarium object to use based on terrariumId
        const terrarium = terrariumId === 'terra1' ? terrarium1 : terrarium2;

        // Create an update object that sets processing to true for this field
        const update = {
            ...terrarium,
            processing: {...terrarium.processing, [field]: true}
        };

        // Update state to indicate that processing is now true for this field
        if (terrariumId === 'terra1') {
            setTerrarium1(update);
        } else {
            setTerrarium2(update);
        }

        // Prepare the message body with the current state of the field
        const body = JSON.stringify({
            currentState: terrarium[field] || 'OFF' // Assume 'OFF' if undefined
        });

        // Publish the message
        clientRef.current.publish({
            destination: `/app/toggle/${terrariumId}/${field}`,
            body: body
        });
    };

    const renderTerrariumInfo = (terrariumId, terrarium) => (
        <div>
            <h4>{terrarium.name || 'Terrarium'}</h4>
            <p>Temperature: {terrarium.temperature !== undefined ? `${terrarium.temperature.toFixed(2)}°C` : 'Loading...'}</p>
            <p>Humidity: {terrarium.humidity !== undefined ? `${Math.round(terrarium.humidity * 100) / 100}%` : 'Loading...'}</p>
            {['light', 'nightLight', 'rain', 'water'].map(field => (
                <p><button key={field} className={`button ${getStatusClass(terrarium[field], terrarium.processing[field])}`}
                        onClick={() => handleToggle(terrariumId, field)}>
                    {field.split(/(?=[A-Z])/).join(" ")}: {terrarium[field] || 'Loading'}
                </button></p>
            ))}
            <p className={getStatusClass(terrarium.mqttState)}>MQTT-Connection: {terrarium.mqttState || 'Loading'}</p>
        </div>
    );

    return (
        <div className="container">
            <header className="jumbotron">
                <h3><strong>Terrarium Dashboard</strong></h3>
            </header>
            <div className="row">
                <div className="col-md-6">
                    {renderTerrariumInfo('terra1', terrarium1)}
                </div>
                <div className="col-md-6">
                    {renderTerrariumInfo('terra2', terrarium2)}
                </div>
            </div>
        </div>
    );
};

export default TerrariumDashboard;

function getStatusClass(status, processing) {
    if (processing) return 'status-loading';
    return status === 'ON' ? 'status-on' : 'status-off';
}
