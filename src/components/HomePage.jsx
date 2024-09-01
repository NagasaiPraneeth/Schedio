import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useEffect } from "react";
import ProjectCard from "./ProjectCard";
export default function HomePage({ handleOptionClick ,handleDomainClick ,handleclick}) {
    const [randomprj,setRandomprj]=useState([]);
    useEffect(() => {
        const getrecentprj = async () => {
          try {
            const response = await axios.get("/en/getrecentprj");
            const data = response.data;
            console.log("Random Projects Data:", data);
            setRandomprj(data);
          } catch (error) {
            console.error("Error occurred:", error);
          }
        };
    
        getrecentprj();
      }, []);

    return (
        <div className="total">
            <div className="Homee">
                <h5>HOME</h5>
            </div>
            <div className="homeelements">
                <div className="basicgrid">
                    <div className="bgridelements" onClick={() => handleDomainClick("Healthcare")}>
                        <div className="forpic">
                            <img src="https://www.nttdata.com/global/en/-/media/nttdataglobal/1_images/industries/healthcare/mv_healthcare.jpg?h=1667&iar=0&w=2667&rev=2558ddff7948493d9a108e414e54d8b2" alt="none" />
                        </div>
                        <div className="forname">
                            <p>Healthcare</p>
                        </div>
                    </div>
                    <div className="bgridelements" onClick={() => handleDomainClick("Artificial Intelligence and Robotics")}>
                        <div className="forpic">
                            <img src="https://assets-global.website-files.com/61845f7929f5aa517ebab941/6440f9477c2a321f0dd6ab61_How%20Artificial%20Intelligence%20(AI)%20Is%20Used%20In%20Biometrics.jpg" alt="none" />
                        </div>
                        <div className="forname">
                            <p>Artificial Intelligence</p>
                        </div>
                    </div>
                    <div className="bgridelements" onClick={() => handleDomainClick("Web development")}>
                        <div className="forpic">
                            <img src="https://sklc-tinymce-2021.s3.amazonaws.com/comp/2023/04/full-stack%20web%20development_1681290664.png" alt="none" />
                        </div>
                        <div className="forname">
                            <p>Web Development</p>
                        </div>
                    </div>
                    <div className="bgridelements" onClick={() => handleDomainClick("Software development")}>
                        <div className="forpic">
                            <img src="https://blog.planview.com/wp-content/uploads/2020/01/Top-6-Software-Development-Methodologies.jpg" alt="none" />
                        </div>
                        <div className="forname">
                            <p>Software development</p>
                        </div>
                    </div>
                    <div className="bgridelements" onClick={() => handleDomainClick("E-Commerce and Marketplace development")}>
                        <div className="forpic">
                            <img src="https://product.hstatic.net/200000388585/product/khoa-ecommerce-leader_499927079ba847f1b0e4f8ec44fa3d90_1024x1024.jpg" alt="none" />
                        </div>
                        <div className="forname">
                            <p>E-Commerce and Marketplace development</p>
                        </div>
                    </div>
                    <div className="bgridelements" onClick={() => handleDomainClick("Cyber Security")}>
                        <div className="forpic">
                            <img src="https://www.ctemag.com/sites/default/files/page_images/blockchain-tech-manufacturing.jpg" alt="" />
                        </div>
                        <div className="forname">
                            <p>Cyber Security</p>
                        </div>
                    </div>
                </div>
                <div className="seemore" onClick={() => handleOptionClick(2)}>
                    <p> See more</p>
                </div>
            </div>
            <div className="maincard" >
                
                    {randomprj.map((suggestion, index) => (
                <div key={index} className="grid-item">
                    <div onClick={()=>{handleclick(suggestion._id)}}>
                    <div class="details">
                            {/* <div class="detailphoto">

                            </div> */}
                            <div class="detailinformation">
                                <p>{suggestion.College} <span>posted on</span>  <span>{new Date(suggestion.Date).toLocaleDateString()}</span></p>
                            </div>
                        </div>
              <ProjectCard projinfo={suggestion} index={index}/>
                        </div>
                </div>
            ))}
             
            </div>
           
            
        </div>
    )
}