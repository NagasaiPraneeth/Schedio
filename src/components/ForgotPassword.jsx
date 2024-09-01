import React, {useState} from "react";
import Header from "./Header";
import Sider from "./Sider";
import "./new-user.css";
import axios from "axios";
import { Link , useNavigate ,useParams} from "react-router-dom";

export default function ForgotPassword(){
    const year= new Date().getFullYear()
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: ''
    });
    const { errorMessage: initialErrorMessage } = useParams();
    const [errorMessage, setErrorMessage] = useState( initialErrorMessage ? decodeURIComponent(initialErrorMessage) : '');
    console.log(errorMessage)

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('form succesful',formData)
        const response = await axios.post('/en/fpassword',formData);
        console.log('response is',response)
        if (response.data.message==='User does not exist'){
            setErrorMessage('User does not exist')
        }else{
            navigate('/Check-email')
        }   
    };

    const handleInputChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    return(
    <div className="abc20">
        <Header />
        <Sider />
        <div className="content120" id="bodyy20">
                <div id="body-content20">
                    <p className="create20">
                        Enter registered mail
                    </p>
                    
                    <form onSubmit={handleSubmit}>
                        <input className="username20" type="email" name="username" placeholder="Email" minLength={3} value={formData.username} onChange={handleInputChange} required autoComplete="username"/>
                        <br />
                        <button type="submit">
                            
                            Next <i className="fa-solid fa-arrow-right" style={{color: "#417ce1"}}></i>
                            
                        </button>  
                    </form>  
                </div>
                <div className="err20">
                    {errorMessage && <p>{errorMessage}</p>}
                </div>
                <div className="sighnup20">
                <p>
                    New to project?<Link to="/">Sign up</Link>
                    
                </p>
                
                </div>
                <div className="terms20">
                   <hr />
                       <p>
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