import React, {useState , useEffect} from "react";
import "./new-user.css";
import Header from "./Header";
import Sider from "./Sider";
import axios from "axios";
import { Link , useNavigate ,useLocation, useParams } from "react-router-dom";

export default function Newhr({ setUserData }){
    const navigate = useNavigate();
    const params = useParams();
    const token = params.token;
    const [errorMessage, setErrorMessage] = useState('');
    const [error, seterror]=useState('');
    const [email, setemail]=useState('');
    useEffect(() => {
        const validateToken = async () => {
            const response = await axios.post(`/en/validate-token/${token}`);
            if (response.data.message==='Invalid token'){
                setErrorMessage(encodeURIComponent('Invalid Token'))
            } else if(response.data.message==='Token expired'){
                setErrorMessage(encodeURIComponent('Token Expired'))
            }
            else{
                setemail(response.data.email)
            }}
            validateToken();
    }, [token]);
    useEffect(() => {
        if(errorMessage) {
            navigate(`/hrsignup/${errorMessage}`)
        }
    }, [errorMessage]);
    const [formData, setFormData] = useState({
        username: '',
        password:'',
        cpassword:'',
    });
    useEffect(() => {
        setFormData(formData => ({ ...formData, mail: email }));
    }, [email]);
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("i am here");
        const response = await axios.post('/en/newhr',formData);
        if (response.data.message==='Mail already registered'){
            setErrorMessage('Mail already registered')
        }else if (response.data.message==='Passwords are not same'){
            seterror('Passwords are not same')
        }else if (response.data.message==='Username Taken'){
            seterror('Username Taken')
        }else{
            setUserData([response.data.email,2,0])
            navigate('/company')
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
            <div id="bodyy20" className="content120">
                <div id="body-content20">
                    <p className="create20">
                    Create your account
                    </p>
                
                    <form onSubmit={handleSubmit}>
                        <input className="username20" type="text" name="username" placeholder="User name" value={formData.username} onChange={handleInputChange} minLength={3}  required autoComplete="name"/>
                        <br />
                        <input type="password" name="password" placeholder="Password" pattern="(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}" value={formData.password} onChange={handleInputChange} minLength={8} required autoComplete="new-password" title="should atleast conatin 1 capital 1 small 1 special char 1 number total of 8 char minimum"/>
                        <br />
                        <input type="password" name="cpassword" placeholder="Confirm Password" pattern="(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}" value={formData.cpassword} onChange={handleInputChange} minLength={8} required autoComplete="new-password" title="should atleast conatin 1 capital 1 small 1 special char 1 number total of 8 char minimum"/>
                        <br />
                        <button type="submit">
                        
                            Continue <i className="fa-solid fa-arrow-right" style={{color: "#417ce1"}} ></i>
                        
                        </button>  
                    </form>  
                </div>
                <div className ="err20">
                    {errorMessage && <p>{errorMessage}</p>}
                    {error && <p>{error}</p>}
                </div>
                <div className="terms20">
                    <hr />
                        <p>
                        By creating you are accepting
                        <br /> <Link to='/t&c'>Terms and conditions</Link>
                        </p>
                </div>
                <div className="copyrights">
                    <p>
                        &copy; all copyrights are reserved to kmit
                    </p>
                </div>
            </div>
        
        
        </div>
    )
}