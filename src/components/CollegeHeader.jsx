import React, { useState, useEffect } from "react";
import "./collegemain.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faProductHunt } from '@fortawesome/free-brands-svg-icons';
import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';



export default function CollegeHeader({ takedata, handlesearch, toggleDashboard1, handlecollegedetail }) {
    const [formData, setFormData] = useState({
        category: 'Any',
        search: '',
    });
    const [searchterm, setSearchTerm] = useState('');
    useEffect(() => {
        takedata(formData);
    }, [formData, takedata]);
    const handlesearchchange = async (event) => {
        event.preventDefault();
        setSearchTerm(event.target.value);


    }

    const projectadd = async () => {
        window.open('http://localhost:3000/ProjectUploadForm', '_blank');
    }

    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate('/');
    };

    const handleTitleClick = () => {
        navigate('/');
    };
    return (
        <div className="headerCollege no-print">
            <div className="headersetCollege">
                <div className="logosetCollege">
                    <div className="logoCollege">
                        {/* <FontAwesomeIcon icon={faProductHunt} style={{ color: "#0db1f8", }} /> */}
                        <img src='../Plogo.png' style={{ width: '35px', height: 'auto', paddingTop: '0px' }} onClick={handleLogoClick} />
                    </div>
                    <div className="titleCollege" onClick={handleTitleClick}>
                        <p>Schedio</p>
                    </div>
                </div>
                <div className="searchbarsetCollege">


                    <div className="searchbarCollege">
                        <input type="search" className="searchsCollege" spellcheck="false" placeholder="Search for projects" value={searchterm} onChange={(event) => { handlesearchchange(event) }} onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                handlesearch(searchterm);
                            }
                        }}></input>
                    </div>
                    <div className="search-iconCollege">
                        <FontAwesomeIcon className="iCollege" icon={faSearch} style={{ color: "white" }} onClick={() => { handlesearch(searchterm) }} />
                    </div>
                </div>
                <div className="profilesetCollege">
                    <div className="okiaddproject">
                        + <span className="okitext" onClick={() => projectadd()}>Add Project</span>
                    </div>
                    <div className="ppp">
                        <FontAwesomeIcon icon={faUser} className="profileset-iconCollege" onClick={() => { toggleDashboard1(); handlecollegedetail() }} />
                    </div>

                </div>

            </div>

        </div>
    );
}
