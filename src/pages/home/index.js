import React, { useState, useEffect } from "react";
import { useMediaQuery } from 'react-responsive';
import UserService from "../../services/user.service";

const Home = () => {
    const [content, setContent] = useState("");
    const isDesktopOrLaptop = useMediaQuery({ minWidth: 1224 })
    const isBigScreen = useMediaQuery({ minWidth: 1824 })
    const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 })
    const isPortrait = useMediaQuery({ orientation: 'portrait' })
    const isRetina = useMediaQuery({ minResolution: '2dppx' })

    useEffect(() => {
        UserService.getPublicContent().then(
            (response) => {
                setContent(response.data);
            },
            (error) => {
                const _content =
                    (error.response
                        && error.response.data
                        && error.response.data.message)
                    || error.message
                    || error.toString();

                setContent(_content);
            }
        );
    }, []);

    return (
        <div className="container">
            <header className="jumbotron">
                {/* Verwende die MediaQuery-Komponente für reaktionsfähiges Rendering */}
                    <h3>{content} (Großes Display)</h3>
                    <h3>{content} (Kleines Display)</h3>
            </header>
        </div>
    );
};

export default Home;