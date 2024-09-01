import React, { useState, useEffect } from "react";
import "./studentProjectPortfolio.css"
import { useNavigate } from "react-router-dom";
import { GoLink } from "react-icons/go";
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import axios from "axios";

export default function StudentProjectProfile({ dis, ...props }) {
    const projid = props.studata;
    const [photolist, setphotolist] = useState([])
    const [comments, setcomments] = useState([])
    const [skills, setskills] = useState([])
    const [students, setstudents] = useState([])
    const [showCopyMessage, setShowCopyMessage] = useState(false);
    const [commentdata, setcommentdata] = useState('');
    const [like, setLike] = useState(0);
    const [key, setKey] = useState(0);
    const [dotclick, setdotclick] = useState(false)
    const [studname, setstudname] = useState('')
    const exit = async () => {
        console.log('yo')
        dis()
    }
    const share = async () => {
        navigator.clipboard.writeText(`http://localhost:3000/main/${projid}`)
            .then(() => {
                setShowCopyMessage(true);
            })
            .catch((err) => {
                console.error('Failed to copy: ', err);
            });
    }
    let [projdata, setprojdata] = useState(null)
    const handlecomment = async (event) => {
        setcommentdata(event.target.value)
    }
    const AddComment = async (event) => {
        event.preventDefault();
        const response = await axios.post('/en/addcomment', { commentdata, projid })
        setcommentdata('')
        fetchData()
    }
    const getstudentdetails = async () => {
        const response = await axios.get("/en/getstudentdetails");
        setstudname(response.data.student_name)
    }
    const deletecomment = async (index, id) => {
        const response = await axios.post('/en/delcomment', { index, id })
        if (response.data === 'success') {
            fetchData()
        }
    }
    const setdot = async () => {
        if (dotclick) {
            setdotclick(false)
        }
        else {
            setdotclick(true)
            await new Promise(resolve => setTimeout(resolve, 6000));
            setdotclick(false)
        }
    }
    const transformdate = (date) => {
        const dateObj = new Date(date);
        const day = dateObj.getDate();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = monthNames[dateObj.getMonth()];
        const year = dateObj.getFullYear();

        let dayWithSuffix;
        if (day === 11 || day === 12 || day === 13) {
            dayWithSuffix = day + 'th';
        } else {
            switch (day % 10) {
                case 1:
                    dayWithSuffix = day + 'st';
                    break;
                case 2:
                    dayWithSuffix = day + 'nd';
                    break;
                case 3:
                    dayWithSuffix = day + 'rd';
                    break;
                default:
                    dayWithSuffix = day + 'th';
            }
        }

        return `${dayWithSuffix} ${month} ${year}`;
    }
    const handlelike = async () => {
        try {
            if (like === 1) {
                const response = await axios.post("/en/removelike", { data: projid });
                if (response.data === "success") {
                    setLike(0);
                    setKey(prevKey => prevKey - 1);
                }
            } else {
                const response = await axios.post("/en/addlike", { data: projid });
                if (response.data === "success") {
                    setLike(1);
                    setKey(prevKey => prevKey + 1);
                }
            }



        } catch (error) {
            console.error("Error updating like:", error);
        }
    };

    useEffect(() => {
        const checklike = async () => {
            try {
                const response = await axios.post('/en/checklike', { data: projid });
                setLike(response.data);
            } catch (error) {
                console.error('Error fetching like count:', error);
            }
        };
        checklike();
    }, [projid]);
    const handleFile = (data) => {
        window.open(`/showFiles/${data}`, '_blank');
    }

    const fetchData = async () => {
        const response = await axios.post('/en/getprojectdata', { data: projid });
        setprojdata(response.data);
        setphotolist(response.data.photos)
        setcomments(response.data.Comments)
        setskills(response.data.Skills)
        setstudents(response.data.Students)
        setKey(response.data.Likes)
    };
    useEffect(() => {
        getstudentdetails();
        fetchData();
    }, [projid]);
    console.log(projdata)
    return (
        <div className="ourprojectdetails1">
            <div className="opbuttons1">
                <div className="opbtn1">
                    <div className="opback1" onClick={() => exit()} style={{ color: "aliceblue" }}>
                        <p><span>&#8592;</span>Go Back</p>
                    </div>
                    <div className="opshare1" onClick={() => share()} style={{ color: "aliceblue" }} >
                        <p>{showCopyMessage === false ? 'Copy Link ' : 'Link Copied'}<GoLink /></p>
                    </div>
                </div>
            </div>
            <div className="opprojects1">
                <div className="opdiv1">
                    <div className="opimvid1">
                        <div className="opvidname1">


                        </div>
                        <div className="opprojectvideo1">
                            {projdata && (<video height="500px" width="600px" src={`/en/image/${projdata.Video}`} controls />)}
                        </div>
                        {(photolist.length !== 0) && (
                            photolist.map((photo, index) => (
                                <img src={`/en/image/${photo}`} key={index} alt="VS" className="stphimg" />
                            ))
                        )}
                    </div>
                    {projdata && (<div className="opdetail1">
                        <div className="opprojectname1">
                            <div className="oppic1">
                                {projdata && (<img src={`/en/image/${projdata.photo}`} alt="VS" className="stdpimg" />)}
                            </div>
                            <div className="oprealpro1">
                                <p>{projdata.Project_Name}</p>
                            </div>
                        </div>
                        <div className="oppostedby1">
                            <p>{projdata.College}</p>
                        </div>
                        <div className="gettingdate1">
                            <div><p> Posted on {transformdate(new Date(projdata.Date))}<span className="oplikes1" onClick={() => handlelike()}>{like === 0 ? <FaRegHeart /> : <FaHeart color="red" />}</span><span className="opnlikes1">{key} Likes</span> </p></div>
                        </div>
                        <div className="gettingdescription1">
                            <p>{projdata.Description}</p>
                        </div>
                        {projdata.File ? <div className="opfolder" onClick={()=>handleFile(projdata.File)}>
                            <p>FOLDER<span>&#128193;</span></p>
                        </div>
                        :
                        <div className="opfolder" onClick={()=>handleFile('65e557edd218d5da2e19a9de')}>
                            <p>FOLDER<span>&#128193;</span></p>
                        </div>
                        }
                        <div className="ourdomain1">
                            <p>DOMAIN:{projdata.Domain}</p>
                        </div>
                        <div className="ourtechnology1">
                            <p>Technologies used: </p>
                            <ul>
                                {skills.map((skill, index) => (
                                    <li key={index}>{skill}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="studentsworking1">
                            <h3>Students worked:</h3>
                            {students.map((student, index) => (
                                <div className="names1" key={index} ><p>{student.stuname}</p></div>
                            ))}
                        </div>
                        <div className="commentsection1">
                            <div className="noofcomment1">
                                <p>{comments.length} comments</p>
                            </div>
                            <form onSubmit={AddComment}>
                                <div className="thereal1">
                                    <input type="text" placeholder="Comment" className="commentinput" value={commentdata} onChange={handlecomment} required />
                                </div>
                                <div className="decide1">
                                    <button type="submit">Submit</button>
                                </div>

                            </form>
                            {(comments.length !== 0) && (
                                comments.map((comment, index) => (
                                    <div className="personcomments1" key={index}>
                                        <div className="commentdetails1">
                                            <div className="letcomdetails1">
                                                <div className="commentpic1">
                                                    <img src={`/en/commentimage/${comment.id}`} alt="VS" className="stcmimg" />
                                                </div>
                                                <div className="commentname1">
                                                    <p>{comment.studentname}</p>
                                                </div>
                                                <div className="commentdate1">
                                                    <p>{transformdate(new Date(comment.Date))}</p>
                                                </div>
                                            </div>
                                            <div className="deletecommentbut1">
                                                {
                                                    (comment.studentname === studname) &&
                                                    <div className="threedots1" onClick={() => setdot()}>
                                                        <p><span>&#65049;</span></p>
                                                        {dotclick && (
                                                            <div className="deletenamebut1" onClick={() => deletecomment(index, projdata._id)}>
                                                                <p>Delete comment <span>&#128465;</span></p>
                                                            </div>
                                                        )}
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        <div className="realcomment1">
                                            <p>{comment.comment}</p>
                                        </div>
                                    </div>
                                ))
                            )}

                        </div>


                    </div>)}

                </div>

            </div>

        </div>

    );
}