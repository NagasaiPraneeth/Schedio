import React from "react";
import "./AboutUs.css"

const AboutUs=()=>{
    return(
        <div className="Aucontainer">
                <div className="Auheader">
                  <h1>About Us</h1>
                  
                </div>
          
                <div className="Ausection">
                  <h3>Our Mission</h3>
                  <p>
                    At Project Platform, we are on a mission to revolutionize project collaboration. We strive to empower
                    individuals and teams to unleash their creativity by providing a user-friendly and efficient platform for
                    uploading, managing, and collaborating on projects.
                  </p>
                </div>
          
                <div className="Ausection">
                  <h3>How It Works</h3>
                  <p>
                    Project Platform simplifies the project management process. Upload your projects, collaborate with team
                    members, and achieve your goals seamlessly. Our platform offers advanced tools and features designed to
                    enhance your project management experience.
                  </p>
                </div>
          
                <div className="Ausection">
                  <h3>Meet Our Team</h3>
                  <div className="Auteam-section">
                    <div className="Auteam-member">
                      <img src="/en/image/65e55060fbd8d3ee2b6f1045" alt="Team Member 1" width="120" height="120" />
                      <p>Nithin</p>
                      
                    </div>
                    <div className="Auteam-member">
                      <img src="/en/image/65e55060fbd8d3ee2b6f1045" alt="Team Member 2" width="120" height="120" />
                      <p>Vishnu</p>
                    
                    </div>
                    <div className="Auteam-member">
                      <img src="/en/image/65e55060fbd8d3ee2b6f1045" alt="Team Member 2" width="120" height="120" />
                      <p>Hrishita</p>
                    
                    </div>
                    <div className="Auteam-member">
                      <img src="/en/image/65e55060fbd8d3ee2b6f1045" alt="Team Member 2" width="120" height="120" />
                      <p>Naga Sai</p>
                    
                    </div>
                    <div className="Auteam-member">
                      <img src="/en/image/65e55060fbd8d3ee2b6f1045" alt="Team Member 2" width="120" height="120" />
                      <p>Florence</p>
                    
                    </div>
                    <div className="Auteam-member">
                      <img src="/en/image/65e55060fbd8d3ee2b6f1045" alt="Team Member 2" width="120" height="120" />
                      <p>Sanjeeva</p>
                    
                    </div>
                  
                  </div>
                </div>
          
                <div className="Ausection contact-info">
                  <h3>Contact Us</h3>
                  <p>
                    If you have any questions or feedback, we'd love to hear from you. Contact us at
                    <a href="mailto:info@projectplatform.com">info@projectplatform.com</a> or give us a call at (123) 456-7890.
                  </p>
                </div>
              </div>
    )
}

export default AboutUs;