import React, {useRef, useState} from 'react';
import CheckButton from "react-validation/build/button";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import AuthService from "../services/auth.service";
import data from "bootstrap/js/src/dom/data";

const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

const ForgotPassword = () => {
    const form = useRef();
    const checkBtn = useRef();

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const onChangeEmail = (e) => {
        const email = e.target.value;
        setEmail(email);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0) {
            AuthService.forgotPassword(email).then(
                (response) => {
                    setLoading(false);
                    if (response.status === 204) {
                        setError("User not found");
                    } else {
                        setMessage(response.data.message);
                    }
                },
                (error) => {
                    setLoading(false);
                    let resMessage = "Lokaler Fehler";
                    resMessage =
                        (error.response
                            && error.response.data
                            && error.response.data.message)
                        || error.message
                        || error.toString();

                    setError(resMessage);
                    console.log(resMessage);
                }
            );
        } else {
            setLoading(false);
        }
    };


    return (
        <div className="col-md-12">
            <h2>Forgot Password</h2>
            {loading ? (
                <div className="form-group">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            ) : (
                <Form onSubmit={handleSubmit} ref={form}>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={onChangeEmail}
                            validations={[required]}
                        />
                    </div>
                    <button type="submit">Submit</button>
                    <CheckButton style={{ display: "none" }} ref={checkBtn} />

                </Form>
            )}
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
        </div>
    );
};

export default ForgotPassword;
