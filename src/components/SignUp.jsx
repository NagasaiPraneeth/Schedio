import React, { useState } from "react";
import Header from "./Header";
import Sider from "./Sider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faProductHunt } from '@fortawesome/free-brands-svg-icons';
import "./signin.css"
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';


export default function SignUp() {
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
        const response = await axios.post('/en/signup', formData);
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
                        Create your account
                    </p>

                    <form onSubmit={handleSubmit}>
                        <input className="username15" type="email" name="username" placeholder="Email" title="min lenth 4 should contain special charecter" minLength={3} value={formData.username} onChange={handleInputChange} required autoComplete="username" />
                        <br />
                        <button type="submit">

                            Next <i className="fa-solid fa-arrow-right"></i>

                        </button>
                    </form>
                </div>
                <div className="err15">
                    {errorMessage && <p>{errorMessage}</p>}
                </div>
                <div className="sighnup15">
                    <p>Already have an account?  <Link to="/SignIn">Login</Link></p>
                </div>
                <div className="terms15">
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