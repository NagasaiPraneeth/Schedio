import React, { useState, useEffect } from "react";
import "./hr-page.css";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faProductHunt } from '@fortawesome/free-brands-svg-icons';
import { faSearch, faUser, faUserPlus, faBars, faHeart, faHouse } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";




export default function Header({ takedata, toggleDashboard1, handlehrdetail, toggleDashboard }) {
    const [formData, setFormData] = useState({
        type: 'Project Search',
        search: '',
    });

    const handlesearchchange = (event) => {
        setFormData({
            ...formData,
            search: event.target.value
        });
    };
    function adjustSelectSize() {
        const selectElement = document.getElementById('cars');
        const selectedOption = selectElement.options[selectElement.selectedIndex];


        const width = getTextWidth(selectedOption.text) + 40; 

        selectElement.style.width = width + 'px';
    }



    function getTextWidth(text) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.font = getComputedStyle(document.body).font;
        const metrics = context.measureText(text);
        return metrics.width;
    }
    /*const save = (event) => {
        setFormData({
            ...formData,
            type: event.target.value
        });
        adjustSelectSize();
        
    };*/
    const save = (event) => {
        setFormData({
            ...formData,
            type: event.target.value
        });
    };
    const handlesearch = async (event) => {
        if (formData.search !== '') {
            takedata(formData);
        }
    };

    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate('/');
    };

    const handleTitleClick = () => {
        navigate('/');
    };

    return (
        <div className="header1" id="hhhhead">
            <div className="headerset1 no-print">
                <div className="logoset1">
                    <div className="dash1">
                        <span className="btn1" onClick={toggleDashboard}><FontAwesomeIcon icon={faBars} style={{ color: "aliceblue" }} /></span>
                    </div>

                    <div className="logo1">
                        {/* <FontAwesomeIcon icon={faProductHunt} style={{color: "#0db1f8",}} /> */}
                        {/* <img src='../Plogo.png' style={{ width: '100px', height: 'auto', paddingTop: '17px' }}/> */}
                        <img src='../Plogo.png' style={{ width: '35px', height: 'auto', paddingTop: '0px' }} onClick={handleLogoClick} />
                    </div>
                    <div className="title1" onClick={handleTitleClick}>
                        <p>Schedio</p>
                    </div>
                </div>
                <div className="searchbarset1">
                    <div className="domain1">
                        <form id="domain">
                            <select name="type" id="cars" value={formData.type} onChange={save}>
                                <option value="Project Search">Project Search</option>
                                <option value="Student Search">Student Search</option>
                            </select>
                        </form>
                    </div>

                    <div className="searchbar1">
                        <input type="search" className="searchs1" spellCheck="false" placeholder="Search for projects" value={formData.search} onChange={handlesearchchange} onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                handlesearch();
                            }
                        }}></input>
                    </div>
                    <div className="search-icon1">
                        <FontAwesomeIcon className="ic" icon={faSearch} style={{ color: "white" }} onClick={()=>handlesearch()} />
                    </div>
                </div>
                <div className="profileset1">
                    <p>
                        <FontAwesomeIcon icon={faUser} className="profileset-icon" onClick={() => { toggleDashboard1(); handlehrdetail() }} />
                    </p>

                </div>

            </div>

        </div>
    );
}
