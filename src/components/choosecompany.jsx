import React from "react";

import { useState } from "react";

import "./collegelogin-page.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faProductHunt } from '@fortawesome/free-brands-svg-icons';
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function Company({ setUserData }) {
    const year = new Date().getFullYear();

    const [term1, setTerm1] = useState('');
    const [suggestions1, setSuggestions1] = useState([]);

    const navigate = useNavigate();
    const handleInputChange = async (event) => {
        const inputValue = event.target.value;
        setTerm1(inputValue);
        if (inputValue.length === 0) {
            setSuggestions1([]);
            return;
        }

        try {
            const response = await axios.get(`/en/company-details?term1=${term1}`);
            const data = response.data;
            setSuggestions1(data);


        } catch (error) {
            console.error('Error fetching autocomplete data:', error);
        }
    };
    const submit = async () => {

        try {
            const collegevalue = term1;
            const response = await axios.post("/en/company-details", { college: collegevalue });
            if (response.data.message === "user saved") {
                setUserData([response.data.email, 2, 1])
                navigate("/hrmain");
            }

        }
        catch (error) {
            console.error('Error navigating:', error);
        }
    };


    const handleLogoClick = () => {
        navigate('/');
    };

    const handleTitleClick = () => {
        navigate('/');
    };





    const handleSuggestionClick = (suggestion1) => {
        setTerm1(suggestion1);
        setSuggestions1([]);
    };

    return (
        <div className="abc">
            <div className="content1" id="header">
                <div className="header-logo">
                    <div className="logo">
                        {/* <FontAwesomeIcon icon={faProductHunt} style={{color: "#0db1f8"}} /> */}
                        <img src='../Plogo.png' style={{ width: '100px', height: 'auto', paddingTop: '17px' }} onClick={handleLogoClick} />
                    </div>
                    <div className="title" onClick={handleTitleClick}>
                        <p>Schedio</p>
                    </div>
                </div>
            </div>

            <div className="content1" id="sider">
                <div className="sider-slogan">
                    <p>
                        From Concept to Completion
                    </p>
                </div>
                <div className="sider-contents">
                    <p>
                        <i className="fa-solid fa-check" ></i>
                        Code empowers evolution
                    </p>
                    <p>
                        <i className="fa-solid fa-check" ></i>
                        Where Imagination meets Achievement
                    </p>
                    <p>
                        <i className="fa-solid fa-check" ></i>
                        From Cool Concepts to Epic Realities
                    </p>
                    <p>
                        <i className="fa-solid fa-check" ></i>
                        Innovate through scripting
                    </p>
                </div>
            </div>
            <div className="content1" id="bodyy">
                <div id="body-content">
                    <p className="create">
                        Enter your Company name
                    </p>

                    <form action="/college-details" method="post" onSubmit={(e) => e.preventDefault()}>
                        <input className="collegename" type="text" id="collegeInput" placeholder="company name" minlength="3" name="college" value={term1} onChange={handleInputChange} required />
                        <br />


                        <div id="suggestions">
                            {suggestions1.map((suggestion1, index) =>
                            (
                                <p key={index} className="suggestion" onClick={() => handleSuggestionClick(suggestion1)}>
                                    {suggestion1}
                                </p>
                            ))}

                        </div>
                        <br />
                        <button type="submit" value="submit" className="submit" onClick={submit}>Next</button>
                    </form>
                </div>

                <div className="terms">
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
    );
}