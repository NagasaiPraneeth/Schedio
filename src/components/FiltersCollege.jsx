import React, { useState, useEffect } from "react";
import "./collegemain.css";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';


export default function FiltersCollege({ sendDataToParent }) {
    const [formData, setFormData] = useState({
        sort_by: 'Upload Date',
        order: false
    });
    const [term, setTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    const handleChange1 = async (event) => {
        const inputdata = event.target.value;
        setTerm(inputdata);
    };
    const handleSuggestionClick = (selectedSuggestion) => {
      /*  setFormData({
            ...formData,
            ["college_name"]: selectedSuggestion
        });
        setTerm(selectedSuggestion);
        setSuggestions([]);*/
    };



    useEffect(() => {
        sendDataToParent(formData);
    }, [formData, sendDataToParent]);

    const handleToggle = () => {
        setFormData({
            ...formData,
            order: !formData.order
        });
    };

    return (
        <div className="filtersCollege">
            
            <div className="filter3College">
                <select name="sort_by" id="year" value={formData.sort_by} onChange={handleChange}>
                    <option value="Name">Name</option>
                    <option value="Likes">Likes</option>
                    <option value="Upload Date">Upload Date</option>
                </select>
            </div>
            <div className="filter4College">
                <button name="order" onClick={handleToggle}>
                    {formData.order ? <> Ascending  <FontAwesomeIcon icon={faArrowUp} /></> : <> Descending  <FontAwesomeIcon icon={faArrowDown} /></>}
                </button>
            </div>
        </div>
    );
}