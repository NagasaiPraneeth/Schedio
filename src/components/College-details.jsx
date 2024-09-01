import React from "react";
import { useState } from "react";
import "./collegelogin-page.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faProductHunt } from '@fortawesome/free-brands-svg-icons';
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

export default function CollegeDetails({ setUserData }) {
    const year = new Date().getFullYear();

    const [term1, setTerm1] = useState('');
    const [suggestions1, setSuggestions1] = useState([]);
    const [error, seterror] = useState()
    const navigate = useNavigate();
    const handleInputChange = async (event) => {
        const inputValue = event.target.value;
        setTerm1(inputValue);
        if (inputValue.length === 0) {
            setSuggestions1([]);
            return;
        }

        try {
            const response = await axios.get(`/en/college-details?term1=${term1}`);
            const data = response.data; 
            setSuggestions1(data);


        } catch (error) {
            console.error('Error fetching autocomplete data:', error);
        }
    };
    const submit = async () => {

        try {
            const collegevalue = term1;
            const response = await axios.post("/en/college-details", { college: collegevalue });
            if (response.data.message === "user saved") {
                setUserData([response.data.email, 0, 1])
                navigate("/main");
            }
            else {
                seterror("College Doesn't exist in our Database")
            }
        }
        catch (error) {
            console.error('Error navigating:', error);
        }
    };
    const handleSuggestionClick = (suggestion1) => {
        setTerm1(suggestion1);
        setSuggestions1([]);
    };


    const handleLogoClick = () => {
        navigate('/');
    };

    const handleTitleClick = () => {
        navigate('/');
    };

    return (
        <div className="abc8">
            <div className="content18" id="header8">
                <div className="header-logo8">
                    <div className="logo8">
                        {/* <FontAwesomeIcon icon={faProductHunt} style={{color: "#0db1f8"}} /> */}
                        <img src='../Plogo.png' style={{ width: '35px', height: 'auto', paddingTop: '0px' }} onClick={handleLogoClick} />
                    </div>
                    <div className="title8" onClick={handleTitleClick}>
                        <p>project</p>
                    </div>
                </div>
            </div>

            <div className="content18" id="sider8">
                <div className="sider-slogan8">
                    <p>
                        From Concept to Completion
                    </p>
                </div>
                <div className="sider-contents8">
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
            <div className="content18" id="bodyy8">
                <div id="body-content8">
                    <p className="create8" >
                        Enter your College name
                    </p>

                    <form action="/college-details" method="post" onSubmit={(e) => e.preventDefault()}>
                        <div className="z">
                            <input className="collegename8" type="text" id="collegeInput" placeholder="college name" minlength="3" name="college" value={term1} onChange={handleInputChange} required />
                            <br />


                            <div id="suggestions8">
                                {suggestions1.map((suggestion1, index) =>
                                (
                                    <p key={index} className="suggestion8" onClick={() => handleSuggestionClick(suggestion1)}>
                                        {suggestion1}
                                    </p>
                                ))}

                            </div>
                        </div>
                        <br />
                        <button type="submit" value="submit" className="submit8" onClick={submit}>Next</button>
                    </form>
                </div>
                <div className="err1505">
                    {error && <p>{error}</p>}
                </div>
                <div className="terms8">
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