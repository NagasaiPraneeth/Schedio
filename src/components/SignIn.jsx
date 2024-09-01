import React, { useState } from "react";
import Header from "./Header";
import Sider from "./Sider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faProductHunt } from '@fortawesome/free-brands-svg-icons';
import axiosInstance from "../settings/axiosInstance";
import "./signin.css"
import { Link, useNavigate } from "react-router-dom";
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';


export default function SignIn({ setUserData }) {
    const year = new Date().getFullYear()
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            console.log(formData)
            const response = await axiosInstance.post('/en/signin', formData);
            console.log("res[ponse is", response)
            if (response.data.message === 'User Not found') {
                setErrorMessage('User Doesn\'t exist');
            }
            else if (response.data.message === 'Wrong Password') {
                setErrorMessage('Wrong Password')
            }
            else if (response.data.checkstudent === 0) {
                setUserData([response.data.user.username, 0, 1]);
                navigate('/main');
            }
            else if (response.data.checkstudent === 1) {

                setUserData([response.data.user.username, 1, 1]);
                navigate('/clgmain');
            }
            else if (response.data.checkstudent === 2) {

                setUserData([response.data.user.username, 2, 1]);
                navigate('/hrmain');
            }
            else {
                console.log(response.data.user.username);
            }

        } catch (error) {
            console.log('catch working')
            console.log('Login error:', error);
            setErrorMessage('Login failed. Please check your credentials.');
        }
    };

    const handleInputChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleLogoClick = () => {
        navigate('/');
    };

    const handleTitleClick = () => {
        navigate('/');
    };

    return (
        <div className="abc15">
            <div className="content115" id="header15">
                <div className="header-logo15">
                    <div className="lll22">
                        <div className="logo15">
                            {/* <FontAwesomeIcon icon={faProductHunt} style={{color: "#0db1f8",}} /> */}
                            <img src='../Plogo.png' style={{ width: '35px', height: 'auto', paddingTop: '0px' }} onClick={handleLogoClick} />
                        </div>
                        <div className="title15" onClick={handleTitleClick}>
                            <p>Schedio</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="content115" id="sider15">
                <div className="sider-slogan15">
                    <p>
                        From Concept to Completion
                    </p>
                </div>
                <div className="sider-contents15">
                    <p>
                        <FontAwesomeIcon icon={faCircleCheck} size="lg" />
                        Code empowers evolution
                    </p>
                    <p>
                        <FontAwesomeIcon icon={faCircleCheck} size="lg" />
                        Where Imagination meets Achievement
                    </p>
                    <p>
                        <FontAwesomeIcon icon={faCircleCheck} size="lg" />
                        From Cool Concepts to Epic Realities
                    </p>
                    <p>
                        <FontAwesomeIcon icon={faCircleCheck} size="lg" />
                        Innovate through scripting
                    </p>
                </div>
            </div>
            <div className="content115" id="bodyy15">
                <div id="body-content15">
                    <p className="create15">
                        Log in to your account
                    </p>

                    <form onSubmit={handleSubmit}>
                        <input className="username15" type="email" name="username" placeholder="Email" minLength={3} value={formData.username} onChange={handleInputChange} required autoComplete="username" />
                        <br />
                        <input type="password" name="password" placeholder="Password" minLength={8} pattern="(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}" value={formData.password} onChange={handleInputChange} required autoComplete="current-password" title="should atleast conatin 1 capital 1 small 1 special char 1 number total of 8 char minimum" />
                        <br />
                        <button type="submit" className="signinsubmit">

                            Log in <i className="fa-solid fa-arrow-right"></i>

                        </button>
                    </form>
                </div>
                <div className="err15">
                    {errorMessage && <p>{errorMessage}</p>}
                </div>
                <div className="sighnup15">
                    <p>
                        New to project?<Link to="/">Sign up</Link>

                    </p>
                    <Link to="/forgot-password">Forgot Password</Link>

                </div>
                <div className="terms15">
                    <hr />
                    <p>
                        By logging in you are accepting
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