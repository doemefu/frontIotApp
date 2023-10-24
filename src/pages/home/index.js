import React, { useState, useEffect } from "react";
import { MediaQuery } from 'react-responsive';

import UserService from "../../services/user.service";

const Home = () => {
    const [content, setContent] = useState("");

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
                <MediaQuery minWidth={768}>
                    <h3>{content} (Großes Display)</h3>
                </MediaQuery>
                <MediaQuery maxWidth={767}>
                    <h3>{content} (Kleines Display)</h3>
                </MediaQuery>
            </header>
        </div>
    );
};

export default Home;