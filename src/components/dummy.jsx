import React,{useState,useCallback} from "react";
import "./ProjectUpload.css"
import Header from './hrheader'
import axios from "axios";
export default function ProjectUploadForm(){
    const [photo, setPhoto] = useState(null);
    const [video, setVideo] = useState(null);
    const[file,setFile]=useState(null);
    const[photoname,setPhotoName]=useState('');
    const[videoname,setVideoName]=useState('');
    const[filename,setFileName]=useState('');
    const handleSubmit = (event) => {
        event.preventDefault();
        saveDetails(event);
      };
function handleVideoChange(event) {
const selectedVideo = event.target.files[0];
if (selectedVideo) {
    const reader = new FileReader();
    reader.onloadend = () => {
        setVideo(reader.result.split(',')[1]);
    };
    reader.readAsDataURL(selectedVideo);
    let temp3=event.target.value;
    const videoname=temp3.replace("C:\\fakepath\\", "");
    setVideoName(videoname);
} else {
    alert('No video selected');
}
}
function handlePhotoChange(event) {
const selectedPhoto = event.target.files[0];
if (selectedPhoto) {
    const reader=new FileReader();
    reader.onloadend = () => {
        setPhoto(selectedPhoto);
        };
        reader.readAsDataURL(selectedPhoto);
        let temp2=event.target.value;
        const photoname=temp2.replace("C:\\fakepath\\", "");
        setPhotoName(photoname);
} else {
    alert('No photo selected');
}
}
function handlechange(event) {
const selectedFile = event.target.files[0];
if (selectedFile && selectedFile.name.endsWith('.zip')) {
    const reader=new FileReader();
    reader.onloadend=()=>{
        setFile(reader.result.split(',')[1]);
    };
    reader.readAsDataURL(selectedFile);
    let temp1=event.target.value;
    const zipname=temp1.replace("C:\\fakepath\\", "");
    setFileName(zipname);
    console.log(filename);
} else {
    alert('please select a valid .zip file');
}
    }
function saveDetails(event) {
try {
const response = axios.get(`/en/uploadDetails`, {
videoname: videoname,
photoname: photoname,
filename: filename,
video: video,
photo: photo,
file: file,
});
console.log("Successfully uploaded");
} catch (error) {
console.log("Error uploading details:", error);
}
}
return(
<div className="bod">
<Header takedata={CategoryData}/>
<div className="bodyy">

<div className="pform">
<div className="dscrpt">
    <p className="description">
        <label htmlFor="description">Description:</label>
        <textarea name="description" id="description" rows="5" required="" className="dscrpt-textarea"></textarea>
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
        <form onSubmit={handleSubmit}>
        <button type="submit" className="submit-button">Submit</button>
        </form>
</div>          
</div>
</div>
</div>
);
            }                                      

