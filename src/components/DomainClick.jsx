import React from "react";
import "./domainclick.css";
import NothingHere from "./nothinghere";
import ProjectCard from "./ProjectCard";

export default function DomainClick({ sugesstions ,handlebackClick, handleclick}) {
    return (
        <div className="sgtotal">
            <div className="sbackbutton">
                <p onClick={()=>handlebackClick()}><span>&#8592;</span>Go Back</p>
            </div>
            {sugesstions && sugesstions.map((suggestion, index) => (
                <div className="grid-item">
                     <div onClick={()=>{handleclick(suggestion._id)}}>

                    <ProjectCard projinfo={suggestion} index={index}/>
                </div>
                </div>
            ))}
            {sugesstions.length===0 && <NothingHere/>}
        </div>
    );
}