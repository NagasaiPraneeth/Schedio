import React, { useState } from "react";
import Header from "./Header";
import Sider from "./Sider";
import "./new-user.css"
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function HrSignUp() {
    const year = new Date().getFullYear()
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: ''
    });
    const { errorMessage: initialErrorMessage } = useParams();
    const [errorMessage, setErrorMessage] = useState(initialErrorMessage ? decodeURIComponent(initialErrorMessage) : '');
    console.log(errorMessage)

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await axios.post('/en/hrsignup', formData);
        if (response.data.message === 'User Already Exists') {
            setErrorMessage('User Already Exists')
        } else {
            const mailid = response.data.mail
            navigate(`/Check-email/${mailid}`)
        }
    };
    const handleInputChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };
    return (
        <div className="abc20">
            <Header />
            <Sider />
            <div className="content120" id="bodyy20">
                <div id="body-content20">
                    <p className="create20">
                        Create your account
                    </p>

                    <form onSubmit={handleSubmit}>
                        <input className="username20" type="email" name="username" placeholder="Email" minLength={3} value={formData.username} onChange={handleInputChange} required autoComplete="username" />
                        <br />
                        <button type="submit">

                            Next <i className="fa-solid fa-arrow-right"></i>

                        </button>
                    </form>
                </div>
                <div className="err20">
                    {errorMessage && <p>{errorMessage}</p>}
                </div>
                <div className="sighnup20">
                    <p>Already have an account?  <Link to="/SignIn">Login</Link></p>
                </div>
                <div className="terms20">
                    <hr />
                    <p>
                        By signing-up in you are accepting
                        <br /> <Link to='/t&c'>Terms and conditions</Link>
                    </p>
                </div>
                <div className="copyrights">
                    <p>
                        Copyright © {year}
                    </p>
                </div>
            </div>
        </div>
    )
}