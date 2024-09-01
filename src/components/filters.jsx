import React, { useState, useEffect } from "react";
import "./hr-page.css";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';


export default function Filters({ sendDataToParent }) {
    const [formData, setFormData] = useState({
        college_name: 'Any',
        category:'Any',
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
        try {
            const response = await axios.get(`/en/data?term=${inputdata}`);
            const data = response.data;
            setSuggestions(data);
        } catch (error) {
            console.log("error", error);
        }
        if(inputdata===''){
            setFormData({
                ...formData,
                ["college_name"]: 'Any'
            });
        }
    };
    const handleSuggestionClick = (selectedSuggestion) => {
        setFormData({
            ...formData,
            ["college_name"]: selectedSuggestion
        });
        setTerm(selectedSuggestion);
        setSuggestions([]);
        sendDataToParent(formData);
    };

    useEffect(() => {
        sendDataToParent(formData);
    }, [formData]);

    const handleToggle = () => {
        setFormData({
            ...formData,
            order: !formData.order
        });
        sendDataToParent(formData);
    };
    return (
        <div className="filters">
            <div className="y">
                <div className="filter1">
                    <input type="text" spellCheck="false" placeholder="search for institutions" name="college_name" value={term} onChange={handleChange1}></input>
                </div>
                <div className="suggestions">
                {suggestions.map((suggestion, index) => (
                        <p key={index} className="suggestion" onClick={() => handleSuggestionClick(suggestion)}>
                            {suggestion}
                        </p>
                    ))}
                
                </div>
            </div>
            <div className="filter2">
                <select name="category" id="year" value={formData.category} onChange={handleChange}>
                    <option value="Any">Any</option>
                    <option value="Web development">Web development</option>
                    <option value="App development">App development</option>
                    <option value="Data Science and Analytics">Data Science and Analytics</option>
                    <option value="Game development">Game development</option>
                    <option value="Cyber Security">Cyber Security</option>
                    <option value="Artificial Intelligence and Robotics">Artificial Intelligence and Robotics</option>
                    <option value="Embedded systems and IOT(Sensors)">Embedded systems and IOT(Sensors)</option>
                    <option value="E-Commerce and Marketplace development">E-Commerce and Marketplace development</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Software development">Software development</option>
                </select>
            </div>
            <div className="filter3">
                <select name="sort_by" id="year" value={formData.sort_by} onChange={handleChange}>
                    <option value="Name">Name</option>
                    <option value="Likes">Likes</option>
                    <option value="Upload Date">Upload Date</option>
                </select>
            </div>
            <div className="filter4">
                <button name="order" onClick={handleToggle}>
                {formData.order ? <> Ascending  <FontAwesomeIcon icon={faArrowUp} /></> :<> Descending  <FontAwesomeIcon icon={faArrowDown} /></>}
                </button>
            </div>
        </div>
    );
}