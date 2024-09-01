import React from "react";
import "./ProjectCard.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faShare } from '@fortawesome/free-regular-svg-icons';
import { faShareNodes } from '@fortawesome/free-solid-svg-icons';


export default function ProjectCard({ projinfo, index }) {
    return (

        <div key={index} className="project-cardPC">
            <div className="cardpartPC">
                <div className="profile-sectionPC">
                    <img className="profile-picturePC" src={`/en/image/${projinfo.photo}`} alt="Profile Picture" />
                    <div className="getlifedude">
                        {<div><FontAwesomeIcon icon={faHeart} style={{ color: "#436f91" }} /></div>}
                        {<div><FontAwesomeIcon icon={faComment} style={{ color: "#436f91" }} /></div>}
                        {<div><FontAwesomeIcon icon={faShareNodes} style={{ color: "#3d6583" }} /></div>} {/* Changed faShareNodes to faShare */}
                    </div>
                </div>
                <div className="pnamedisPC">
                    <div className="pnamePC">
                        <p>{projinfo.Project_Name}</p>
                    </div>
                    <div className="pdiscriptPC">
                        <p>{projinfo.Description}</p>
                    </div>
                    <div className="langcontPC">
                        <div className="langPC">
                            <div className="notlikethis">{projinfo.Skills && projinfo.Skills.map((skill)=>(
                                <div className="huh">#{skill}</div>
                            ))}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}