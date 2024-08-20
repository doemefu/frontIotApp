import React, { useEffect, useState } from "react";
import api from "../services/api";

const DeviceStatusBlock = ({ deviceName }) => {
    const [data, setData] = useState([]);
    const [liveStatus, setLiveStatus] = useState("Unknown");

    const formatDeviceName = (name) => {
        if (!name) return "";
        const noSpaces = name.replace(/\s+/g, '');
        return noSpaces.charAt(0).toLowerCase() + noSpaces.slice(1);
    };

    const formattedDeviceName = formatDeviceName(deviceName);

    useEffect(() => {
        api
            .get('data/deviceStatus', {
                params: {
                    device: formattedDeviceName
                }
            })
            .then(res => {
                console.log(res.data);
                setData(res.data);
                const statusValue = res.data[24];
                if (statusValue === 1.0) {
                    setLiveStatus("Operational");
                } else if (statusValue === 0.0) {
                    setLiveStatus("Down");
                }
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    const stripeWidth = 8;
    const stripeMargin = 3;
    const totalStripes = 24;
    const padding = 20;
    const totalWidth = totalStripes * (stripeWidth + stripeMargin) + 2 * padding;

    return (
        <div className="status-container" style={{ width: totalWidth + 'px', height: '67px', position: 'relative' }}>
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
            <div className="status-title" style={{
                position: 'absolute',
                top: '10px',
                left: '20px',
                color: '#FFFFFF'
            }}>
                {deviceName}
            </div>
            <div className="status-text" style={{
                position: 'absolute',
                top: '10px',
                right: '20px',
                color: liveStatus === 'Operational' ? '#36D56C' : (liveStatus === 'Down' ? '#DF484A' : '#738199')
            }}>
                {liveStatus}
            </div>
        </div>
    );
};

export default DeviceStatusBlock;
