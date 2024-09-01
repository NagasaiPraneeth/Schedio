import React, { useState, useCallback } from "react";
import "./ProjectUpload.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faProductHunt } from '@fortawesome/free-brands-svg-icons';
import { faSearch, faUser, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import Header from './hrheader'
import Filters from "./filters";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Uploadsucess from "./uploadsucess";
import uploadpending from "./uploadpending";
import Uploadpending from "./uploadpending";

export default function ProjectUploadForm() {


    const [photos, setPhotos] = useState([]);
    const [video, setVideo] = useState(null);
    const [file, setFile] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [photoname, setPhotoName] = useState('');
    const [videoname, setVideoName] = useState('');
    const [filename, setFileName] = useState('');
    const [pphotoname, setProfilePhotoName] = useState('');
    const [totalSize, setTotalSize] = useState(0);
    const [fileSize, setFileSize] = useState(0);
    const [videoSize, setVideoSize] = useState(0);
    const [profilePhotoSize, setProfilePhotoSize] = useState(0);
    const [percent, setPercent] = useState(0);
    const [formData, setFormData] = useState({
        category: 'Any',
        search: '',
    });
    const FilterData = useCallback((data) => {

    }, []);

    const CategoryData = useCallback((data) => {

    }, []);
    const navigate =useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault(); 
        saveDetails();
    };
    const [languages, setLanguages] = useState([]);
    const [teams, setTeams] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [teamInputValue, setTeamInputValue] = useState("");
    const [sugesstions2, setSugesstions2] = useState([]);
    const [sugesstions3, setSugesstions3] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [domain, setDomain] = useState("");
    const [plagarismValue, setPlagarismValue] = useState(0);
    const [plagarismErrorMessage, setPlagarismErrorMessage] = useState('');
    const [display,setDisplay]=useState(0);


    const handleInputChange = async (event) => {
        const inputValue = event.target.value;
        setInputValue(inputValue);
        console.log(inputValue);


        if (inputValue.trim() === "") {
            setSugesstions2([]);
            return;
        }
        else {
            try {
                const response = await axios.get(`/en/getskills?term=${encodeURIComponent(inputValue)}&languages=${languages}`);
                const data = response.data;
                setSugesstions2(data);
                console.log(data);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            }
        }
    };

    const handleTeamInputChange = async (event) => {
        const teamInputValue = event.target.value;
        setTeamInputValue(teamInputValue);


        if (teamInputValue.trim() === "") {
            setSugesstions3([]);
            return;
        }
        else {
            try {
                console.log(teamInputValue,teams)
                const response = await axios.get(`/en/getteam?term=${encodeURIComponent(teamInputValue)}&teams=${teams}`);
                const data = response.data;
                setSugesstions3(data);
            } catch (error) {
                console.log("Error fetching suggestions:", error);
            }
        }
    };



    const handleKeyDown = (sugesstion) => {
        addLanguage(sugesstion.trim());
        setInputValue("");
        setSugesstions2([])
    };
    const handleTeamKeyDown = (sugesstion) => {
        console.log(sugesstion)
        addTeamMember(sugesstion);
        setTeamInputValue("");
        setSugesstions3([])
    };

    const addLanguage = (newLanguage) => {
        setLanguages([...languages, newLanguage]);
        console.log(newLanguage);
    };

    const addTeamMember = (newTeamMember) => {
        setTeams([...teams, newTeamMember]);
    };

    const removeLanguage = (indexToRemove) => {
        const updatedLanguages = languages.filter((_, index) => index !== indexToRemove);
        setLanguages(updatedLanguages);

    };

    const removeTeamMember = (indexToRemove) => {
        const updatedTeams = teams.filter((_, index) => index !== indexToRemove);
        setTeams(updatedTeams);
    };

    function handleProfilePhoto(event) {
        const selectedProfilePhoto = event.target.files[0];
        setProfilePhotoSize(selectedProfilePhoto.size / (1024 * 1024))

        if (selectedProfilePhoto) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePhoto(reader.result.split(',')[1]);
            };
            reader.readAsDataURL(selectedProfilePhoto);

            let temp = event.target.value;
            const profilePhotoName = temp.replace("C:\\fakepath\\", "");
            setProfilePhotoName(profilePhotoName);
            alert('photo uploaded')
        } else {
            alert('No photo selected');
        }
    }




    function handleVideoChange(event) {
        const selectedVideo = event.target.files[0];
        setVideoSize(selectedVideo.size / (1024 * 1024));

        if (selectedVideo) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setVideo(reader.result.split(',')[1]);
            };
            reader.readAsDataURL(selectedVideo);
            let temp3 = event.target.value;
            const videoname = temp3.replace("C:\\fakepath\\", "");
            setVideoName(videoname);
            alert('uploaded video')

        } else {
            alert('No video selected');
        }
    }

    function handlePhotoChange(event) {
        const selectedPhoto = event.target.files[0]; 

        console.log("photo");
        if (selectedPhoto) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const photoDataUrl = reader.result.split(',')[1];
                setPhotos(prevPhotos => [...prevPhotos, photoDataUrl]);
            };
            reader.readAsDataURL(selectedPhoto);
            alert('photos selected')
        }
        else {
            alert('No photo selected');
        }
    }

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
    const save = (event) => {
        setFormData({
            ...formData,
            category: event.target.value
        });
        adjustSelectSize();
    };
    function handlechange(event) {
        const selectedFile = event.target.files[0];
        setFileSize(selectedFile.size / (1024 * 1024))
        if (selectedFile && selectedFile.name.endsWith('.zip')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFile(reader.result.split(',')[1]);
            };
            reader.readAsDataURL(selectedFile);
            let temp1 = event.target.value;
            const zipname = temp1.replace("C:\\fakepath\\", "");
            setFileName(zipname);
            console.log(filename);
            alert('file uploaded')
        } else {
            alert('please select a valid .zip file');
        }
    }
    const handlePlagarism = async() => {
        setPlagarismValue(2);
        setPlagarismErrorMessage('Running Plagarism Test Please Wait')
        console.log(description);
        setPercent(100);
        if (description.length !== 0) {

            const response = await axios.post('/en/checkPlagiarism', { textToCheck: description });
            console.log(response);
            setPercent(response.data);
        }

        console.log("percent is ", percent);
        if (percent < 30) {
            setPlagarismValue(3);
            setPlagarismErrorMessage('No Plagarised Content Found')
        }
        else {
            setPlagarismValue(1);
            setPlagarismErrorMessage('Plagarised Content Found')
        }
    };


    function saveDetails() {
        console.log(photos.length);
        try {
            if ((fileSize + videoSize + profilePhotoSize) > 40) {
                alert("size exceeded");
            }
            else if (plagarismValue === 0) {
                alert('Please run Plagarism Check');
            }
            else if (plagarismValue === 2) {
                alert('Checking Plagrism Wait');
            }
            else if (plagarismValue === 1) {
                alert('Your Description is Plagarised. It cannot be Submitted');
            }
            else if (videoname.length === 0) {
                alert('video required!');
            }
            else if (languages.length === 0) {
                alert('languages required');
            }
            else if (domain.length === 0) {
                alert('Domain required');
            }
            else if (teams.length === 0) {
                alert('Team members  required');
            }
            else if (pphotoname.length === 0) {
                alert('profile photo required');
            }
            else {
                const response = axios.post(`/en/uploadDetails`, {
                    videoname: videoname,
                    photoname: photoname,
                    filename: filename,
                    video: video,
                    photos: photos,
                    file: file,
                    title: title,
                    description: description,
                    profilePhoto: profilePhoto,
                    languages: languages,
                    domain: domain,
                    teams: teams,
                })
                console.log("successfully uploaded.")
                setDisplay(2)
                if(response.data.message==="Project details saved successfully"){
                    setDisplay(1);
                }
            };


        } catch (error) {
            alert('File size too large');

            console.log("Error uploading details:", error);
        }
    }






    return (
        <div className="bod">
            <Header takedata={CategoryData} />
            {display===0 && (<div className="bodyy">


                <form onSubmit={handleSubmit}>
                    <div className="studetails">
                        <div className="sdetails">
                            <div className="probackground">
                                <p className="probackground-p">
                                    Project upload
                                </p>
                            </div>
                            <div className="sphoto">
                                <label htmlFor="profilePic">
                                    {/* <i className="fa-solid fa-user-plus" style={{ color: 'rgb(4, 67, 112)' }}></i> */}
                                    <FontAwesomeIcon icon={faUserPlus} className="addPhoto" />

                                    <br />
                                    <p className="sphoto-p">
                                        Add photo
                                    </p>
                                </label>
                                <input type="file" name="profilePic" id="profilePic" accept="image/*" className="sphoto-input" onChange={handleProfilePhoto} />

                            </div>
                            <div className="sname">

                                <p>Project title:   <input type="text" spellcheck="false" className="sname-input" onChange={(e) => setTitle(e.target.value)} required /></p>


                            </div>

                        </div>
                    </div>

                    <div className="pform">
                        <p>
                            Select project domain:
                            <select name="category" id="cars" onChange={(e) => setDomain(e.target.value)} className="pform-select" required>
                                <option value="Web development">Web development</option>
                                <option value="App development">App development</option>
                                <option value="Data Science and Analytics">Data Science and Analytics</option>
                                <option value="Game development">Game development</option>
                                <option value="Cyber Security">Cyber Security</option>
                                <option value="Artificial Intelligence and Robotic">Artificial Intelligence and Robotics</option>
                                <option value="Embedded systems and IOT(Sensors)">Embedded systems and IOT(Sensors)</option>
                                <option value="E-Commerce and Marketplace development">E-Commerce and Marketplace development</option>
                                <option value="Healthcare">Healthcare</option>
                                <option value="Software development">Software development</option>
                                <option value="Any">Not listed</option>
                            </select>
                        </p>
                        <div className="dscrpt">
                            <p className="description">
                                <label htmlFor="description">Description:</label>
                                <textarea name="description" id="description" rows="5" required className="dscrpt-textarea" onChange={(e) => setDescription(e.target.value)}></textarea>

                            </p>
                            <div className="file-upload">
                                <label htmlFor="file-upload" className="file-upload-label"  >
                                    Upload files
                                </label>
                                <input type="file" id="file-upload" className="file-upload-input" accept=".zip" onChange={handlechange} />

                                <p>
                                    Drag files here
                                </p>
                            </div>




                        </div>
                        <div className="plagrism">
                            <button className="plag" type="button" onClick={() => handlePlagarism()}>
                                Run Plagarism Test
                            </button>
                            <p>{plagarismErrorMessage}</p>
                        </div>

                        <div className="lang">
                            <p className="lang-p">
                                Languages used:
                            </p>
                            <div id="langContainer">

                                <input type="text" id="searchInput" placeholder="Add languages..." value={inputValue} onChange={handleInputChange} />
                                <div id="tagContainer">
                                    {languages.map((language, index) => (
                                        <div key={index} className="tagContainer">
                                            <span className="tagText">{language}</span>
                                            <button className="removeTag" onClick={() => removeLanguage(index)}>X</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div id="suggestions">
                                {sugesstions2.map((sugesstion, index) =>
                                (
                                    <div key={index} className="skills" onClick={() => handleKeyDown(sugesstion)}>
                                        <p>{sugesstion}</p>
                                    </div>
                                ))}

                            </div>
                        </div>
                        <div className="media-upload">
                            <p className="video">
                                Upload media:
                                <label htmlFor="video-upload" className="media-upload-label" >
                                    Upload video
                                </label>
                                <input type="file" id="video-upload" className="media-upload-input" accept="video/*" onChange={handleVideoChange} />
                                <label htmlFor="photo-upload" className="media-upload-label" >
                                    Upload photos
                                </label>
                                <input type="file" id="photo-upload" className="media-upload-input" accept="image/*" onChange={handlePhotoChange} />
                            </p>
                        </div>
                        <div className="team-mem">
                            <p>
                                Add team members:
                            </p>
                            <div id="groupContainer">
                                <div id="tagGroupmem">
                                    {teams.map((teamMember, index) => (
                                        <div key={index} className="team-member-tag">
                                            <span>{teamMember.student_name}</span>
                                            <button onClick={() => removeTeamMember(index)}>X</button>
                                        </div>
                                    ))}
                                </div>
                                <input type="text" id="searchGroupmem" placeholder="Search..." value={teamInputValue} onChange={handleTeamInputChange} />
                                <div id="suggestions">
                                    {sugesstions3.map((sugesstion, index) => (
                                        <div key={index} className="team_member" onClick={() => handleTeamKeyDown(sugesstion)}>
                                            <p>{sugesstion.student_name}</p>
                                        </div>
                                    ))}


                                </div>

                            </div>
                        </div>
                        <div>
                            <button type="submit" className="submit-button">Submit</button>
                        </div>
                    </div>

                </form>
            </div>
 )}
 {display === 2 && (
            <Uploadpending/>
        )}
 {display === 1 && (
            <Uploadsucess/>
        )}
 </div>
                                    );
}

