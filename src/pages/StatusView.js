import React, { useEffect, useState } from "react";
import AuthService from "../services/auth.service";
import { Link } from "react-router-dom";
import api from "../services/api";

const StatusView = () => {
    const currentUser = AuthService.getCurrentUser();
//    const [data, setData] = useState(Array(25).fill(-1));
    const [data, setData] = useState([]);
    const [liveStatus, setLiveStatus] = useState("unknown");


    // Fetch data and update the state
    useEffect(() => {
        if (currentUser) {
            api
                .get('data/deviceStatus', {})
                .then(res => {
                    console.log(res.data);
                    setData(res.data);
                    const statusValue = res.data[24];
                    if (statusValue === 1.0) {
                        setLiveStatus("operational");
                    } else if (statusValue === 0.0) {
                        setLiveStatus("down");
                    }
                })
                .catch(err => {
                    console.error(err);
                });
            console.log(data);
        }
    }, []);

    if (!currentUser) {
        return (
            <div className="container">
                <p>You must be <Link to="/login">logged in</Link> to view this page.</p>
            </div>
        );
    }


    const stripeWidth = 8;
    const stripeMargin = 3;
    const totalStripes = 24;
    const padding = 20;
    const totalWidth = totalStripes * (stripeWidth + stripeMargin) + stripeMargin + 2*padding;
    //const totalWidth = 270;
    //rand neben bars: 40

    return (
        <div className="container">
            <header className="jumbotron">
                <h3><strong>Device states will be shown here</strong></h3>
            </header>
            <div className="status-container" style={{width: totalWidth + 'px', height: '67px'}}>
                {data.slice(0, 24).map((hour, index) => {
                    let backgroundColor;
                    switch (hour) {
                        case -1:
                            backgroundColor = '#738199'; // Grey for no data
                            break;
                        case 0:
                            backgroundColor = '#DF484A'; // Red
                            break;
                        case 1:
                            backgroundColor = '#36D56C'; // Green
                            break;
                        default:
                            backgroundColor = '#FFA500'; // Orange for mixed states
                    }
                    return (
                        <div
                            key={index}
                            className="stripe"
                            style={{
                                backgroundColor,
                                width: stripeWidth + 'px',
                                height: '19px',
                                margin: `0 ${stripeMargin / 2}px`
                            }}
                        />
                    );
                })}
                <div className="status-text" style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    color: liveStatus === 'operational' ? '#36D56C' : (liveStatus === 'down' ? '#DF484A' : '#738199')
                }}>
                    {liveStatus}
                </div>
                <div className="status-text" style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    color: '#FFFFFF'
                }}>
                    Terra 1
                </div>
            </div>
        </div>
    );
};


export default StatusView;