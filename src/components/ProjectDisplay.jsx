import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faSearch } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useEffect } from "react";
import ProjectCard from "./ProjectCard";
export default function ProjectDisplay({ handleskillprj, handleclick, handleskillList }) {
    const [suggestions, setSuggestions] = useState([]);
    const [searchterm, setSearchterm] = useState("");
    const [randomprj, setRandomprj] = useState([]);
    const handlesearchchange = (event) => {
        event.preventDefault();

        const inputValue = event.target.value;

        const response = axios.get(`/en/getskills?term=${encodeURIComponent(inputValue)}&languages=${tags}`)
        response.then(function (result) {
            console.log(result.data);
            setSuggestions(result.data)
        }).catch(function (error) {
            console.error("Error: ", error);
        });



        setSearchterm(event.target.value);
    };
    useEffect(() => {
        const getmostlikedprj = async () => {
            try {
                const response = await axios.get("/en/getmostlikedprj");
                const data = response.data;
                console.log("Random Projects Data:", data);
                setRandomprj(data);
            } catch (error) {
                console.error("Error occurred:", error);
            }
        };

        getmostlikedprj();
    }, []);


    const [tags, setTags] = useState([]);

    const handleKeyDown = (data) => {
        addTag(data)
        setSuggestions([])
        setSearchterm("")
    };

    const addTag = (tagText) => {
        setTags((prevTags) => [...prevTags, tagText]);
    };

    const removeTag = (index) => {
        setTags((prevTags) => prevTags.filter((_, i) => i !== index));
    };

    return (
        <div className="nprojects">
            <div className="nrealheading">
                <h4>PROJECTS</h4>
            </div>
            <div className="nsheading">
                <h5>VARIOUS PROJECTS IN</h5>
            </div>
            <div className="techflex">
                <div className="techflexele">
                    <div
                        id="npython"
                        className="ntechelements"
                        onClick={() => {
                            handleskillprj("html");
                        }}
                    >
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/800px-Python-logo-notext.svg.png"
                            alt=""
                        />
                    </div>
                    <div
                        id="njava"
                        className="ntechelements"
                        onClick={() => {
                            handleskillprj("html");
                        }}
                    >
                        <img
                            src="https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/181_Java_logo_logos-512.png"
                            alt=""
                        />
                    </div>
                    <div
                        id="ncpp"
                        className="ntechelements"
                        onClick={() => {
                            handleskillprj("html");
                        }}
                    >
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/ISO_C%2B%2B_Logo.svg/1200px-ISO_C%2B%2B_Logo.svg.png"
                            alt=""
                        />
                    </div>
                    <div
                        id="nkotlin"
                        className="ntechelements"
                        onClick={() => {
                            handleskillprj("html");
                        }}
                    >
                        <img
                            src="https://www.freepnglogos.com/uploads/javascript-png/javascript-logo-transparent-logo-javascript-images-3.png"
                            alt=""
                        />
                    </div>
                    <div
                        id="nmern"
                        className="ntechelements"
                        onClick={() => {
                            handleskillprj("html");
                        }}
                    >
                        <img
                            src="https://inzint.com/wp-content/uploads/2023/02/Features-of-Mern-stack-development-services-You-Should-Know-1.png"
                            alt=""
                        />
                    </div>
                    <div id="nmean" className="ntechelements">
                        <p>AND MANY MORE</p>
                    </div>
                </div>
            </div>
            <div className="tagsearch">
                <div className="ntagsearch">
                    <p>Search for tags</p>
                </div>
                <div className="searchbarset1">
                    <div className="searchbar1">
                        {/* <input type="search" className="searchs1" placeholder="Search for projects" onChange={handlesearchchange} />  */}
                        {/* <TagSearch   handlesearchchange={ handlesearchchange} />*/}

                        <div className="searchs1">
                            <input
                                type="text"
                                id="searchInputId"
                                value={searchterm}
                                placeholder="Add tags..."
                                onChange={handlesearchchange}
                            />
                            

                            <div id="tagSearchContainerId">
                                {tags.map((tag, index) => (
                                    <div key={index} className="tagContainer">
                                        <span className="tagText">{tag}</span>
                                        <button
                                            className="removeTag"
                                            onClick={() => removeTag(index)}
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>

                        </div>
                        <div
                            className="search-icon2"
                            onClick={() => {
                                handleskillList(tags);
                            }}
                        >
                            <FontAwesomeIcon
                                className="search-icon1-i"
                                icon={faSearch}
                                style={{ color: "white" }}
                            />
                        </div>
                        <br />
                        {suggestions !== "" &&
                            (<div className="sugessions">
                                {suggestions.map((suggestion, index) => (
                                    <p key={index} onClick={() => handleKeyDown(suggestion)}>{suggestion}</p>
                                ))}
                            </div>)}
                    </div>
                </div>
            </div>
            <div className="tags">
                <div className="tagelements">
                    <p>#python</p>
                </div>
                <div className="tagelements">
                    <p>pythondeveloper</p>
                </div>
                <div className="tagelements">
                    <p>#java</p>
                </div>
                <div className="tagelements">
                    <p>#python</p>
                </div>
                <div className="tagelements">
                    <p>#python</p>
                </div>
                <div className="tagelements">
                    <p>#python</p>
                </div>
            </div>

            <div className="maincard">
                {randomprj.map((suggestion, index) => (
                    <div key={index} className="grid-item">
                        <div onClick={()=>{handleclick(suggestion._id)}}>

                        <ProjectCard projinfo={suggestion} index={index}/>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
