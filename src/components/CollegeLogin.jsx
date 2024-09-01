import React, { useState } from "react";
import "./collegelogin-page.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faProductHunt } from '@fortawesome/free-brands-svg-icons';
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';


export default function CollegeLogin() {
  const year = new Date().getFullYear();
  const navigate = useNavigate();
  console.log(useParams)
  const { errorMessage: initialErrorMessage } = useParams();
  const [errorMessage, setErrorMessage] = useState(initialErrorMessage ? decodeURIComponent(initialErrorMessage) : '');
  const [term, setTerm] = useState('');
  const [suggestions1, setSuggestions1] = useState([]);
  const handleInputChange = async (event) => {
    const inputValue = event.target.value;
    setTerm(inputValue);
    if (inputValue.length === 0) {
      setSuggestions1([]);
      return;
    }
    else {
      try {
        const response = await axios.get(`/en/signup_college?term=${inputValue}`);
        const data = response.data;
        setSuggestions1(data);


      } catch (error) {
        console.error('Error fetching autocomplete data:', error);
      }
    }
  };


  const handleSuggestionClick = (suggestion1) => {
    setTerm(suggestion1);
    setSuggestions1([]);
  };

  const handle = async (event) => {
    event.preventDefault();
    try {
      const CollegeName = term;
      const response = await axios.post('/en/signup_college', { serverCollegeName: CollegeName });


      if (response.data.message === 'User already registered') {
        setErrorMessage('User Already Exists');
      }
      else {
        const mailid = response.data.mail
        navigate(`/Check-email/${mailid}`)
      }
    } catch (error) {
      console.log(error);
    }

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
            {/* <FontAwesomeIcon icon={faProductHunt} style={{ color: "#0db1f8" }} /> */}
            <img src='../Plogo.png' style={{ width: '35px', height: 'auto', paddingTop: '0px' }} onClick={handleLogoClick} />
          </div>
          <div className="title8" onClick={handleTitleClick}>
            <p>Schedio</p>
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
            Enter your college name
          </p>

          <form onSubmit={handle} method="post">
            <div className="uiux">
            <div className="clkj">
            <input name="serverCollegeName" className="collegename" type="text" id="collegeInput8" placeholder="College Name" value={term} onChange={handleInputChange} minLength="3" required />
            </div>
            <br />
            <div id="suggestions8">
              {suggestions1.map((suggestion1, index) =>
              (
                <p key={index} className="suggestion" onClick={() => handleSuggestionClick(suggestion1)}>
                  {suggestion1}
                </p>
              ))}
            </div>
            </div>
            <button type="submit">

              Next <i className="fa-solid fa-arrow-right"></i>

            </button>
          </form>
          <div className="err8">
            {errorMessage && <p>{errorMessage}</p>}
          </div>
        </div>
        <div className="sighnup8">
          <p>Already have an account?  <Link to="/SignIn">Login</Link></p>
          <p>Can't find your College name here? <Link to="/Ins">Click here</Link></p>
        </div>
        <div className="terms8">
          <hr />
          <p>
            By signing up, you are accepting
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
