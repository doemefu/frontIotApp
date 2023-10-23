import React, { useState, useEffect } from "react";
import UserService from "../../services/user.service";
import EventBus from "../../utils/EventBus";

const HeaderMod = () => {
    const [content, setContent] = useState("");

    useEffect(() => {
        UserService.getModeratorBoard().then(
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

                //403 equals to HTTP unauthorized
                if(error.response && error.response.status === 403) {
                    EventBus.dispatch("logout");
                }
            }
        );
    }, []);

    return (
        <div className="container">
            <header className="jumbotron">
                <h3>{content}</h3>
            </header>
        </div>
    );
};

export default HeaderMod;