const express = require('express');
const cors = require('cors');
const { MongoClient, GridFSBucket } = require('mongodb');
const bodyParser = require('body-parser');
const retry = require('retry'); // Importing the retry library
const AdmZip = require('adm-zip');
const mongoose = require('mongoose');
const axios=require('axios');
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
const{projects}=require('../settings/env.js');
const { ObjectId } = require('mongodb');

const mongoURI = process.env.URL;
const databaseName = 'projectpalace';

// Create a MongoClient without the poolSize option
const client = new MongoClient(mongoURI);

let db;

// Function to connect to MongoDB with retry logic
async function connectWithRetry() {
  const operation = retry.operation({
    retries: 5, // Number of retries
    factor: 2, // Exponential backoff factor
    minTimeout: 1000, // Minimum timeout in milliseconds
    maxTimeout: 5000, // Maximum timeout in milliseconds
  });

  return new Promise((resolve, reject) => {
    operation.attempt(async () => {
      try {
        await client.connect();
        db = client.db(databaseName);
        console.log('MongoDB connected successfully');
        resolve();
      } catch (err) {
        if (operation.retry(err)) {
          console.error('Error connecting to MongoDB, retrying...');
          return;
        }
        reject(err);
      }
    });
  });
}

connectWithRetry().catch(error => {
  console.error('MongoDB connection error:', error);
});


const details = async (req, res) => {
  try {
    if (!db) {
      throw new Error('MongoDB connection not established.');
    }

    const { file, filename, video, videoname, photos, photoname, title, description, languages, domain, profilePhoto, teams } = req.body;
    let photoIds = [];
    let videoId;
    let profilePhotoId;
    let fileId;

    let updatedTeams = teams.map(student => {
      return {
        id: new mongoose.Types.ObjectId(student._id),
        stuname: student.student_name
      };
    });
    let studentIds = updatedTeams.map(ite => ite.id);

    // Upload file to GridFS
    const uploadFile = async (data, name) => {
      const buffer = Buffer.from(data, 'base64');
      const bucket = new GridFSBucket(db);
      const uploadStream = bucket.openUploadStream(name);
      const fileId = uploadStream.id;

      await new Promise((resolve, reject) => {
        uploadStream.end(buffer, (error) => {
          if (error) {
            console.error(`Error uploading ${name}:`, error);
            reject(error);
          } else {
            console.log(`${name} uploaded successfully, stored under id:`, fileId);
            resolve(fileId);
          }
        });
      });

      return fileId;
    };

    const uploadPhotoPromises = photos.map(async (photo, i) => {
      const photoId = await uploadFile(photo, `photo_${i}`);
      photoIds.push(photoId);
    });

    videoId = videoname ? await uploadFile(video, videoname) : null;
    profilePhotoId = profilePhoto ? await uploadFile(profilePhoto, 'profilePhoto') : null;
    fileId=filename ? await uploadFile(file, filename) : null;

    // Save project details to MongoDB
    const course = new projects({
      Domain: domain,
      Skills: languages,
      College: req.session.loggedInCollege,
      Project_Name: title.charAt(0).toUpperCase() + title.slice(1),
      Likes: 0,
      Description: description,
      Date: new Date(),
      photo: profilePhotoId,
      Video: videoId,
      Students: updatedTeams,
      photos: photoIds,
      File: fileId,
      versionkey: false
    });

    await course.save();
    console.log("Project details saved successfully");
    const updateStudentSkills = async (studentId, newSkills, domain, projectId) => {

      try {
    
        const studentsCollection = db.collection('students');
    
        const student = await studentsCollection.findOne({ _id: studentId });
    
    
    
        if (student) {
    
          const existingSkills = new Set(student.skills);
    
          newSkills.forEach(skill => existingSkills.add(skill)); // Add new skills avoiding duplicates
    
    
    
          const updatedDomains = Array.from(new Set([...student.Domains, domain])); // Add new domain avoiding duplicates
    
    
    
          await studentsCollection.updateOne(
    
            { _id: studentId },
    
            {
    
              $set: {
    
                skills: [...existingSkills],
    
                projects: [...student.projects, projectId],
    
                Domains: updatedDomains
    
              }
    
            }
    
          );
    
          console.log(`Skills, projects, and domain updated for student with ID: ${studentId}`);
    
        } else {
    
          console.log(`Student with ID ${studentId} not found`);
    
        }
      } catch (error) {
    
        console.error('Error updating student skills, projects, and domain:', error);
    
      }
    
    };
    
    
    
    connectWithRetry().catch(error => {
    
      console.error('MongoDB connection error:', error);
    
    });

    const projectId = new mongoose.Types.ObjectId(course._id);

    // Update skills for students
    for (const studentId of studentIds) {
      await updateStudentSkills(studentId, languages, domain, projectId);
    }

    res.status(200).json({ message: "Project details saved successfully",error:'ok' });
  } catch (error) {
    console.error("Error uploading project details:", error);
    res.status(500).json({ error: "Error uploading project details" });
  }
};


const getFile = async (req,res) => {
  console.log('hellllo')
  console.log(req.body.data)
  const  fileId  = req.body.data;
  console.log('Fetching file:', fileId);
  try {
    if (!db) {
      throw new Error('MongoDB connection not established.');
    }
    const bucket = new GridFSBucket(db);

    const fileDocument = await db.collection('fs.files').findOne({ _id: new ObjectId(fileId) });
    if (!fileDocument) {
      return res.status(404).send('File not found');
    }

    // Store the filename in a variable
    const filename = fileDocument.filename;
    console.log('Filename:', filename);

    const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));

    let data = [];
    downloadStream.on('data', (chunk) => {
      data.push(chunk);
    });
    console.log(data);

    downloadStream.on('end', async () => {
      try {
        
        const buffer = Buffer.concat(data);
        const zip = new AdmZip(buffer);
        const zipEntries = zip.getEntries();
        const folderStructure = getFolderStructure(zipEntries);
        const fileContents = {};
        zipEntries.forEach((zipEntry) => {
          const textFileExtensions = ['.txt', '.csv', '.json', '.xml', '.yml', '.md', '.html', '.js', '.py', '.cpp', '.java', '.c', '.cs', '.php', '.rb', '.go', '.rs', '.swift', '.kt', '.ts', '.jsx', '.tsx', '.css', '.scss','-html', '.sass', '.less', '.bson', '.bytes', '.bind', '.disposition', '.type', '.cookie', '.signature', '.debug', '.property', '.eslintrc', '.github', '.nycrc', '.md', '.d.ts', '.d.ts.map', '.js', '.LICENSE', '.json', '.md', '.test', '.json', '.depd', '.destroy', '.first', '.url', '.html', '.etag', '.express', '.handler'];
          if (textFileExtensions.some(ext => zipEntry.name.endsWith(ext))) {
            const fileContentsBuffer = zipEntry.getData();
            const contents = fileContentsBuffer.toString('utf8');
            fileContents[zipEntry.entryName] = contents;
          }
        });
        console.log('success')
        res.status(200).json({ filename,folderStructure, fileContents });
      } catch (error) {
        console.error('Error extracting zip file:', error);
        res.status(500).send('Internal Server Error - Invalid Zip Format');
      }
    });

    downloadStream.on('error', (error) => {
      console.error('Error fetching file:', error);
      res.status(500).send(`Error fetching file ${filename}`);
    });
  } catch (error) {
    console.error('Error fetching file content:', error);
    res.status(500).send('Internal Server Error');
  }

  
};
function getFolderStructure(zipEntries) {
  const folderStructure = {};

  zipEntries.forEach((zipEntry) => {
    const pathComponents = zipEntry.entryName.split('/');
    let currentFolder = folderStructure;

    pathComponents.forEach((component, index) => {
      if (index === pathComponents.length - 1) {
        currentFolder[component] = null;
      } else {
        if (!currentFolder[component]) {
          currentFolder[component] = {};
        }
        currentFolder = currentFolder[component];
      }
    });
  });

  return folderStructure;
}

const explainCode = async (req,res) => {
  console.log(req.body.data);
  const code=req.body.data;
 // console.log(req.body.data);
  // node --version # Should be >= 18
// npm install @google/generative-ai

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const MODEL_NAME = "gemini-pro";
const API_KEY = "YOUR_API_KEY";

async function runChat() {
  const genAI = new GoogleGenerativeAI('AIzaSyD4MBRVZSfaXvrvsji4Z_LRrgtPztIcOk4');
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 1,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: "user",
        parts: [{ text: "user will give a code of a programming file of a project"}],
      },
      {
        role: "model",
        parts: [{ text: "```\n// This is the main JavaScript file for the project.\n\n// Import the necessary modules.\nimport React from 'react';\nimport ReactDOM from 'react-dom';\nimport App from './App';\n\n// Render the App component to the DOM.\nReactDOM.render("}],
      },
      {
        role: "user",
        parts: [{ text: "const mongoose = require('mongoose');const express = require('express');const path = require('path');const jwt = require('jsonwebtoken');const bcrypt = require('bcryptjs');const app = express();const bodyParser = require('body-parser');const session = require('express-session');const Mailgen = require('mailgen');const nodemailer = require('nodemailer');const { EMAIL, PASSWORD, JWT_SECRET, SESSION_KEY, Course, college, Department, recruiter, companies, skills } = require('../settings/env.js');require('dotenv').config();app.use(express.static('../build'));app.use(bodyParser.json());// college suggestionsconst getsignupCollege = async (req, res) => {    try {        const term1 = req.query.term;        const regex1 = new RegExp(term1, 'i');        const colleges = await college.find({ college_name: regex1 }).select('college_name').limit(10);        const suggestions1 = colleges.map(college => college.college_name);        res.json(suggestions1);    }    catch (err) {        console.error('Error retrieving colleges:', err);        res.status(500).json({ error: 'Error in retriveing colleges' });    }}//SESSION_CHECKERconst checkSessionEndpoint = async (req, res) => {    if (req.session.loggedInemail) { //if exists condition will be true        res.json([req.session.loggedInemail, req.session.typeofuser, req.session.status, req.session.third, req.session.fourth]);        // typeof user 0 is student        //1 is college        //2 is hr        //status is 0 or 1 depending if the user completed all sign up procedure    } else {        // If no session null will be returned        res.json(null)    }}//colege send mailerconst signup_college = async (req, res) => {    const CollegeName = req.body.serverCollegeName;    try {        // Find the document based on the provided college name        const result = await college.findOne({ college_name: CollegeName });        //console.log(result.password)        if (result.password !== undefined) {            // User already has a password            res.json({ message: \"User already registered\", CollegeName: \"null\" });        }        else if (result) {            const username = result.email_address;            //mail has found            const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '10m' });            let config = {                service: 'gmail',                auth: {                    user: EMAIL,                    pass: PASSWORD,                },            };            let transporter = nodemailer.createTransport(config);            let MailGenerator = new Mailgen({                theme: \"default\",                product: {                    name: \"PROJECT PALACE\",                    link: 'https://mailgen.js/'                },            });            let response = {                body: {                    name: CollegeName,                    intro: \"Please click on the following link to set your password:\",                    action: {                        instructions: \"Click the button below to set your password:\",                        button: {                            color: \"#22BC66\",                            text: \"Set your password\",                            link: `http://localhost:3000/set-password/ne/${token}`                        }                    },                    outro: \"If you did not request to set a password, no further action is required on your part.\",                },            };            let mail = MailGenerator.generate(response);            let message = {                from: EMAIL,                to: username,                subject: \"Your OTP for Verification\",                html: mail,            };            transporter.sendMail(message)            res.json({ message: \"Mail Sent\", mail: username });        } else {            res.status(404).json({ error: 'College not found' });        }    }    catch (error) {        console.error('Error retrieving data from MongoDB:', error);        res.status(500).json({ error: 'Internal server error' });    }}"}],
      },
      {
        role: "model",
        parts: [{ text: "```"}],
      },
      {
        role: "user",
        parts: [{ text: "const mongoose = require('mongoose');const express = require('express');const path = require('path');const jwt = require('jsonwebtoken');const bcrypt = require('bcryptjs');const app = express();const bodyParser = require('body-parser');const session = require('express-session');const Mailgen = require('mailgen');const nodemailer = require('nodemailer');const { EMAIL, PASSWORD, JWT_SECRET, SESSION_KEY, Course, college, Department, recruiter, companies, skills } = require('../settings/env.js');require('dotenv').config();app.use(express.static('../build'));app.use(bodyParser.json());// college suggestionsconst getsignupCollege = async (req, res) => {    try {        const term1 = req.query.term;        const regex1 = new RegExp(term1, 'i');        const colleges = await college.find({ college_name: regex1 }).select('college_name').limit(10);        const suggestions1 = colleges.map(college => college.college_name);        res.json(suggestions1);    }    catch (err) {        console.error('Error retrieving colleges:', err);        res.status(500).json({ error: 'Error in retriveing colleges' });    }}//SESSION_CHECKERconst checkSessionEndpoint = async (req, res) => {    if (req.session.loggedInemail) { //if exists condition will be true        res.json([req.session.loggedInemail, req.session.typeofuser, req.session.status, req.session.third, req.session.fourth]);        // typeof user 0 is student        //1 is college        //2 is hr        //status is 0 or 1 depending if the user completed all sign up procedure    } else {        // If no session null will be returned        res.json(null)    }}//colege send mailerconst signup_college = async (req, res) => {    const CollegeName = req.body.serverCollegeName;    try {        // Find the document based on the provided college name        const result = await college.findOne({ college_name: CollegeName });        //console.log(result.password)        if (result.password !== undefined) {            // User already has a password            res.json({ message: \"User already registered\", CollegeName: \"null\" });        }        else if (result) {            const username = result.email_address;            //mail has found            const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '10m' });            let config = {                service: 'gmail',                auth: {                    user: EMAIL,                    pass: PASSWORD,                },            };            let transporter = nodemailer.createTransport(config);            let MailGenerator = new Mailgen({                theme: \"default\",                product: {                    name: \"PROJECT PALACE\",                    link: 'https://mailgen.js/'                },            });            let response = {                body: {                    name: CollegeName,                    intro: \"Please click on the following link to set your password:\",                    action: {                        instructions: \"Click the button below to set your password:\",                        button: {                            color: \"#22BC66\",                            text: \"Set your password\",                            link: `http://localhost:3000/set-password/ne/${token}`                        }                    },                    outro: \"If you did not request to set a password, no further action is required on your part.\",                },            };            let mail = MailGenerator.generate(response);            let message = {                from: EMAIL,                to: username,                subject: \"Your OTP for Verification\",                html: mail,            };            transporter.sendMail(message)            res.json({ message: \"Mail Sent\", mail: username });        } else {            res.status(404).json({ error: 'College not found' });        }    }    catch (error) {        console.error('Error retrieving data from MongoDB:', error);        res.status(500).json({ error: 'Internal server error' });    }}"}],
      },
      {
        role: "model",
        parts: [{ text: "This is a Node.js Express application that uses MongoDB as a database to store data. It includes email verification, user sessions, and various routes for user registration, authentication, and data retrieval. Here's a breakdown of the code:\n\n1. **Importing Modules**:\n   - The necessary modules are imported, including `mongoose` for MongoDB connectivity, `express` for the web framework, `path` for file path manipulation, `jwt` for JSON Web Tokens, `bcrypt` for password hashing, `bodyParser` for parsing request bodies, and `express-session` for managing user sessions.\n\n2. **Express App Setup**:\n   - The Express app is configured to handle JSON requests and serve static files from the `../build` directory.\n\n3. **Database Connection**:\n   - Mongoose is used to connect to the MongoDB database. The connection is established using the `mongoose.connect()` method, ensuring that a connection is established before proceeding.\n\n4. **College Name Suggestions**:\n   - A route `getsignupCollege` is defined to handle requests for college name suggestions. It takes a `term` parameter in the query string and searches for colleges with names similar to the `term` using a regular expression. The results are limited to 10 suggestions and returned as an array of college names.\n\n5. **Session Checking**:\n   - The `checkSessionEndpoint` route checks if a user has an active session. It checks the `req.session.loggedInemail` property and returns an array containing various session details, including the user's email, user type, status, and other optional values. If no session exists, it returns `null`.\n\n6. **College Sign Up Mailer**:\n   - The `signup_college` route is used to send an email for college sign up. It takes the college name as a request body parameter. If a college with that name is found in the database, an email is sent to the college's email address containing a link for setting a password. A JSON response is sent back, indicating the status of the operation.\n\nThis script combines MongoDB, Express, and various Node.js modules to provide a backend for user registration, session management, and email verification, specifically for colleges. The routes and functions are designed to handle college-related operations like name suggestions, email verification, and password setup. The integration of JWT, bcrypt, and email functionality ensures secure and efficient user authentication and account setup processes."}],
      },
    ],
  });
  const result = await chat.sendMessage(code);
  const response = result.response;
  res.status(200).json({ ans: response.text()});
  console.log(response.text());
}

runChat();

  
};

const checkPlagarism = async (req,res) => {
  //const { textToCheck } = req.body.textToCheck;
    console.log(req.body.textToCheck)
    const textToCheck=req.body.textToCheck;
    const options = {
        method: 'POST',
        url: 'https://plagiarism-checker-and-auto-citation-generator-multi-lingual.p.rapidapi.com/plagiarism',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': '6ac8aba9fcmsh58413014b14e402p1d6408jsn839d018b7b26',
          'X-RapidAPI-Host': 'plagiarism-checker-and-auto-citation-generator-multi-lingual.p.rapidapi.com'
        },
        data: {
          text: textToCheck,
          language: 'en',
          includeCitations: req.body.includeCitations || false,
          scrapeSources: req.body.scrapeSources || false
        }
      };
    
    try {
    const response = await axios.request(options);
    const answer=(response.data.percentPlagiarism);
    console.log(answer);
    res.json(answer);
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
    }

  
};
const Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;

// Assuming you have a Mongoose connection established
const conn = mongoose.connection;
db = client.db(databaseName);
const gfs = Grid(db);

const getPhoto = async (req, res) => {
  console.log(req.body);
  try {
    const photoId = req.body.photoId; // Your photoId
    const bucket = new GridFSBucket(db);

    // Check if photoId is valid
    if (!ObjectId.isValid(photoId)) {
      return res.status(400).json({ message: 'Invalid photoId' });
    }

    const fileId = new ObjectId(photoId);
    const file = await bucket.find({ _id: fileId }).next();

    // Check if file exists
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Set appropriate content type
    res.set('Content-Type', file.contentType);

    // Read output to browser
    
    const downloadStream = bucket.openDownloadStream(fileId);
    downloadStream.pipe(res);
  } catch (error) {
    console.error('Error getting photo:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const uploadProfilePhoto = async (req, res) => {
  const { profilePhoto, pphotoname, userId } = req.body;
  console.log(userId);
  const buffer = Buffer.from(profilePhoto, 'base64');
  const bucket = new GridFSBucket(db);

  // Adjust the content type based on your actual content type
  const contentType = 'image/jpeg'; 

  const uploadStream = bucket.openUploadStream(pphotoname, { contentType });
  const fileId = uploadStream.id;

  await new Promise((resolve, reject) => {
    uploadStream.end(buffer, (error) => {
      if (error) {
        console.error(`Error uploading ${pphotoname}:`, error);
        reject(error);
      } else {
        console.log(`${pphotoname} uploaded successfully, stored under id:`, fileId);
        resolve(fileId);
      }
    });
  });

  // Update student document with fileId
  const studentsCollection = db.collection("students");
  const filter = { _id: new ObjectId(userId) };
  const updateDoc = { $set: { photo: fileId } };
  const result = await studentsCollection.updateOne(filter, updateDoc);

  if (result.modifiedCount === 1) {
    res.json({ success: true, message: 'Profile photo updated successfully.' });
  } else {
    res.status(404).json({ success: false, message: 'Student not found.' });
  }
};

const updateDescription = async (req, res) => {
  const { studentDescription, userId } = req.body;
  console.log(userId)

  // Connect to MongoDB
  const client = new MongoClient(process.env.URL);
  await client.connect();

  try {
    const db = client.db('projectpalace');
    const studentsCollection = db.collection('students');

    // Find the document with the provided userId
    const query = { _id: new ObjectId(userId) };
    const existingStudent = await studentsCollection.findOne(query);

    if (existingStudent) {
      // Check if the document contains a description field
      if (!existingStudent.Description) {
        // If description field is not present, create it
        await studentsCollection.updateOne(query, { $set: { Description: studentDescription } });
      } else {
        // If description field is present, update its value
        await studentsCollection.updateOne(query, { $set: { Description: studentDescription } });
      }
      console.log("Description saved succesfully")
      res.status(200).send('Description updated successfully.');
    } else {
      res.status(404).send('Student not found.');
    }
  } catch (error) {
    console.error('Error updating description:', error);
    res.status(500).send('An error occurred while updating description.');
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
};

 
module.exports = {
  details,
  getFile,
  explainCode,
  checkPlagarism,
  getPhoto,
  uploadProfilePhoto,
  updateDescription
};
