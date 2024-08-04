import React, { useEffect, useState } from "react";
import AuthService from "../services/auth.service";
import { Link } from "react-router-dom";
import api from "../services/api";

const StatusView = () => {
    const currentUser = AuthService.getCurrentUser();
//    const [data, setData] = useState(Array(25).fill(-1));
    const [data, setData] = useState([]);

    // Fetch data and update the state
    useEffect(() => {
        if (currentUser) {
            api
                .get('data/deviceStatus', {})
                .then(res => {
                    console.log(res.data);
                    setData(res.data);
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


    return (
        <div className="container">
            <header className="jumbotron">
                <h3><strong>Influx Data will be shown here</strong></h3>
            </header>
            <svg width="550" height="300" viewBox="0 0 550 300">
                <g className="animated-slide hi-2">
                    <path
                        fill="#212937"
                        style={{filter: 'url(#dropshadow)'}}
                        d="M550 283.7c0 1.1-.9 2-2 2H21c-1.1 0-2-.9-2-2v-64c0-1.1.9-2 2-2h527c1.1 0 2 .9 2 2v64z"
                    />
                    <g id="hi-bars">
                        {data.map((hour, index) => {
                            let fillColor;
                            switch (hour) {
                                case -1:
                                    fillColor = '#FFA500'; // Orange for no data
                                    break;
                                case 0:
                                    fillColor = '#DF484A'; // Red
                                    break;
                                case 1:
                                    fillColor = '#36D56C'; // Green
                                    break;
                                default:
                                    fillColor = '#738199'; // Default color if needed
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