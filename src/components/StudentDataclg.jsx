import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./sp.css";
import { Link } from "react-router-dom";
import { GoLink } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import NothingHere from "./nothinghere";

export default function StudentDataclg({ dis, handleclick, ...props }) {
    const navigate = useNavigate()
    const projid = props.studata;
    const [showCopyMessage, setShowCopyMessage] = useState(false);
    const exit = async () => {
        dis()
    }
    const printDivRef = useRef(null);
    const handleDownload = async () => {
        alert("Please enable background graphics in more settings for better output.");
        window.print();
    };
    const share = async () => {
        navigator.clipboard.writeText(`http://localhost:3000/clgmain/${projid}`)
            .then(() => {
                setShowCopyMessage(true);
            })
            .catch((err) => {
                console.error('Failed to copy: ', err);
            });
    }
    
    let [studata, setstudata] = useState('null')
    let [projects, setprojects] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.post('/en/getstudendata', { data: projid });
            setstudata(response.data);
        };

        fetchData();
    }, [projid]);
    useEffect(() => {
        const fetchprojdata = async () => {
            const response = await axios.post('/en/fetchprojdata', { data: studata.projects })
            setprojects(response.data)
        }
        fetchprojdata();
    }, [studata])
    console.log(studata)
    return (
        <div className="sprofile">
                <div className="sbuttons no-print">
                    <div className="stubutton">
                        <div className="bookmark">
                            <div style={{color: "aliceblue"}} className="nby" onClick={() => handleDownload()}><p>Download <span>&#11123;</span></p></div>
                        </div>
                        <div className="exit">
                            <div style={{color: "aliceblue"}} className="nbu" onClick={() => share()}><p>{showCopyMessage === false ? 'Copy Link ' : 'Link Copied'}<GoLink/></p></div>
                            <div style={{color: "aliceblue"}} className="nbu"onClick={() => exit()}><p>Exit <span>&#x2715;</span></p></div>    
                        </div>
                    </div>
                </div>
                <div className="studetails1">
                    <div className="sdetails1">
                        <div className="probackground"></div>
                        <div className="sphoto">
                            {studata.photo && (<img  src={`/en/image/${studata.photo}`} alt="Profile Picture"/>)}
                        </div>
                        <div className="sname1">
                                <p>{studata.student_name}</p>
                                <p>{studata.email_address}</p>
                                <p>{studata.college_name}</p>
                        </div>
                    </div>
                    <div className="sprojects1">
                        <div className="sprojectdetails">
                            <p>No. of Projects:{studata.projects?.length || 0}</p>
                            <h4>Active Domains worked for</h4>
                            <ul>
                                    {(studata.Domains && studata.Domains.length > 0) ? (
                                        studata.Domains.map((domain, index) => (
                                            <li key={index}>{domain}</li>
                                        ))
                                    ) : (
                                        <li>None</li>
                                    )}
                            </ul>

                        </div>
                    </div>
                </div>
                <div className="sbio">
                    <div className="stubio">
                        <p>{studata.Description}</p>
                    </div>

                </div>
                <div className="stuskill">
                    <div className="sskill">
                        <div>
                            <h4>Skills:</h4>
                            <ul>
                                {(studata.skills && Array.isArray(studata.skills) && studata.skills.length > 0) ? (
                                    studata.skills.map((skill, index) => (
                                        <li key={index}>{skill}</li>
                                    ))
                                ) : (
                                    <li>None</li>
                                )}
                            </ul>
                        </div>
                    </div>

                </div>
                <div className="spro">
                    <div className="spro1">
                        <h3>PROJECTS</h3>
                    </div>
                </div>
                {projects.length > 0 ? (projects.map((project, index) => (
                <div className="project-card1" key={index} onClick={()=>handleclick(project._id)}>
                    <div className="cardpart1">
                        <img className="profile-picture1" src={`/en/image/${project.photo}`} alt="Profile Picture1"/>
                        <div className="pdiscript1">
                            <p>
                                {project.Description}
                            </p>
                        </div>
                    </div>
                    <div className="pname1">
                        <p>
                            {project.Project_Name}
                        </p>
                    </div>
                </div>
                 ))
                 ) : (
                     <NothingHere />
                 )}
            </div>
    )
}