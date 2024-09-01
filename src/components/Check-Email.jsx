import React from "react";
import "./Check-Email.css"
import { useParams } from "react-router-dom";
import Header from "./Header";


export default function () {

    const params = useParams();
    const token = params.mailid;
    return (
        <div>
             <Header/>
        <div className="container">
            <div className="cont">
                <h1 className="heading">Check Your Email</h1>
                <p className="para">We've sent an email to {token} with a link to set your password. Please check your inbox and follow the instructions in the email.</p>
            </div>
        </div>

        </div>
       
    )

}