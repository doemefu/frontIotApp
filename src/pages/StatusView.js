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
    const stripeMargin = 2;
    const totalStripes = 24;
    //const totalWidth = totalStripes * (stripeWidth + stripeMargin) + stripeMargin;
    const totalWidth = 270;
    //rand neben bars: 40

    return (
        <div className="container">
            <header className="jumbotron">
                <h3><strong>Device states will be shown here</strong></h3>
            </header>
            <svg width={totalWidth} height="300" viewBox={`0 0 ${totalWidth} 300`}>
                <g className="animated-slide hi-2">
                    <path
                        fill="#212937"
                        style={{filter: 'url(#dropshadow)'}}
                        d={`M${totalWidth} 283.7c0 1.1-.9 2-2 2H2c-1.1 0-2-.9-2-2v-64c0-1.1.9-2 2-2h${totalWidth - 4}c1.1 0 2 .9 2 2v64z`}
                    />
                    <g id="hi-bars">
                        {data.slice(0, 24).map((hour, index) => {
                            let fillColor;
                            switch (hour) {
                                case -1:
                                    fillColor = '#738199'; // grey for no data
                                    break;
                                case 0:
                                    fillColor = '#DF484A'; // Red
                                    break;
                                case 1:
                                    fillColor = '#36D56C'; // Green
                                    break;
                                default:
                                    fillColor = '#FFA500'; // Orange for mixed states
                            }
                            return (
                                <path
                                    key={index}
                                    fill={fillColor}
                                    d={`M${43.2 + index * 8} 266.4c0 1.2-1 2.3-2.3 2.3h-.5c-1.2 0-2.3-1-2.3-2.3v-13.5c0-1.2 1-2.3 2.3-2.3h.5c1.2 0 2.3 1 2.3 2.3v13.5z`}
                                />
                            );
                        })}
                    </g>
                </g>
                {/* Title in the top left */}
                <text x="10" y="30" fill="#FFFFFF" fontSize="20" fontWeight="bold">Terra1</text>
                {/* Status in the top right */}
                <text x="470" y="30"
                      fill={liveStatus === 'operational' ? '#36D56C' : (liveStatus === 'down' ? '#DF484A' : '#738199')}
                      fontSize="20" fontWeight="bold">
                    {liveStatus}
                </text>
                {/* Define the drop shadow filter */}
                <defs>
                    <filter id="dropshadow" height="130%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                        <feOffset dx="2" dy="2" result="offsetblur"/>
                        <feComponentTransfer>
                            <feFuncA type="linear" slope="0.5"/>
                        </feComponentTransfer>
                        <feMerge>
                            <feMergeNode/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
            </svg>
        </div>
    );
};

export default StatusView;