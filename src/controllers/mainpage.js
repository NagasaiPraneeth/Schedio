const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
require('dotenv').config();
const session = require('express-session');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const Grid = require('gridfs-stream');
const natural=require('natural');
const GridFS = Grid(mongoose.connection, mongoose.mongo);
const {college,projects,Course,recruiter,skills} = require('../settings/env.js');
const { constants } = require('fs/promises');
const { ObjectId } = require('mongodb');

const app = express();
app.use(express.static('./public'));
app.use(bodyParser.json());
const conn = mongoose.createConnection(process.env.URL);
let gfs;
conn.once('open', () => {
  // Init stream
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'fs'
  });
});

//suggest college names
const getdata = async(req,res)=>{
    try{
        if(req.query.term!==""){
            const term=req.query.term;
            const regex=new RegExp(term,"i");
            const colleges=await college.find({college_name:regex}).select("college_name").limit(4);
            const sugesstions=colleges.map(college=>college.college_name);
            res.json(sugesstions);
        }
        else{
            res.json([])
        }
    }
    catch(error){
        console.log("error",error);
    }
    
}

//return projects for hr main
const projectlist = async(req,res)=>{
    mail=req.session.loggedInemail
    let {category,college_name,sort_by,order,page} = req.query
    catquery={Domain:category}
    clgquery={College:college_name}
    sortquery={}
    u_limit=page*10
    l_limit=u_limit-10
    if (category==='Any'){
        catquery={}
    }
    if (college_name==='Any'){
        clgquery={}
    }
    if (order==='true'){
        order=1
    }
    else{
        order=-1
    }
    if (sort_by==='Name'){
        sortquery={Project_Name:order}
    }
    else if (sort_by==='Likes'){
        sortquery={Likes:order}
    }
    else if (sort_by==='Upload Date'){
        sortquery={Date:order}
    }
    const projlists = await projects.find({$and:[clgquery,catquery]}).sort(sortquery)
    const a=~~((projlists.length)/10)
    let m;
    if (projlists.length===0){
        m=5;
    }
    else{
        m=2;
    }
    res.json({list:projlists.slice(l_limit,u_limit),total_pages:a+1,display:m})
}

const collegeprojdisplay = async (req, res) => {
    try {
        const college = req.session.loggedInCollege;
        const receivedData = req.body.receivedData;
        const query = { College: college };
        let sortField = 'Date';
        let sortOrder = -1;

        if (receivedData.sort_by === 'Likes') {
            sortField = 'Likes';
        } else if (receivedData.sort_by === 'Upload Date') {
            sortField = 'Date';
        }

        sortOrder = receivedData.order ? 1 : -1;

        const projlists = await projects.find(query).sort({ [sortField]: sortOrder }).select('photo Project_Name Description Skills');

        res.json({ list: projlists, college: college });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



//pipe image
const image = async(req, res) => {
    try 
    {
        const id = req.params.id;
        if (!id || id.length !== 24) {
            throw new Error('Invalid ObjectId format');
        }
        
        const fileId = new mongoose.Types.ObjectId(id);
        //console.log(fileId);
        await gfs.openDownloadStream(fileId).pipe(res);
    }
    catch(error)
    {
        console.log(error);
    }
};


const commentimage = async(req,res)=>{
    const Id = new mongoose.Types.ObjectId(req.params.id);
    const stinfo = await Course.findOne({_id:Id})
    const hrinfo = await recruiter.findOne({_id:Id})
    if(stinfo){
        const photoid = stinfo.photo
        const fileId = new mongoose.Types.ObjectId(photoid);
        await gfs.openDownloadStream(fileId).pipe(res);
    }
    else if(hrinfo){
        const photoid = hrinfo.photo
        const fileId = new mongoose.Types.ObjectId(photoid);
        await gfs.openDownloadStream(fileId).pipe(res);
    }
}

const getstudata = async(req,res)=>{
    const data =req.body.data;
    const studentId = new mongoose.Types.ObjectId(data);
    const stinfo = await Course.findOne({_id:studentId});
    res.json(stinfo)
}
const fetchprojdata = async(req,res)=>{
    const datas = req.body.data;
    const array = [];
    for(let key in datas){
        let data = datas[key];
        let projId = new mongoose.Types.ObjectId(data);
        let projinfo = await projects.findOne({_id:projId});
        console.log(projinfo)
        array.push(projinfo)
    }
    res.json(array)
}

//add bookmark
const addbookmark = async(req,res)=>{
    const mail = req.session.loggedInemail;
    const id = req.body.data;
    const oid = new mongoose.Types.ObjectId(id);
    const user = await recruiter.findOne({email_address:mail})
    const list = user.bookmarks
    list.push(oid);
    user.bookmarks=list;
    user.save()
    res.json("success")
}

//remove bookmark
const removebookmark = async(req,res)=>{
    const mail = req.session.loggedInemail;
    const id = req.body.data;
    const oid = new mongoose.Types.ObjectId(id);
    const user = await recruiter.findOne({email_address:mail})
    const list = user.bookmarks
    var index = list.indexOf(oid);
    list.splice(index, 1);
    user.bookmarks=list;
    user.save()
    res.json("success")
}

//check bookmark
const checkbookmark = async(req,res)=>{
    const mail = req.session.loggedInemail;
    const id = req.body.data;
    console.log(id)
    const oid = new mongoose.Types.ObjectId(id);
    const user = await recruiter.findOne({email_address:mail})
    const list = user.bookmarks
    res.json(Number(list.includes(oid)))
}
const validateurl = async(req,res)=>{
    let {projid}=req.query;
    try{
    const oid = new mongoose.Types.ObjectId(projid);
    const projlist = await projects.find({_id:oid})
    const stulist = await Course.find({_id:oid})
    if (projlist.length!==0){
        res.json(1)
    }
    else if(stulist.length!==0){
        res.json(2)
    }
    else{
        res.json(0)
    }
    }
    catch(error){
        res.json(0)
    }
}

//return projects by search
const tokenizer = new natural.WordTokenizer();
const getSearchProjects = async (req, res) => {
    const term = req.query.term;
    const tokens = tokenizer.tokenize(term);
    const partialSearchResults = await projects.find({ 
        $or: [
            { Project_Name: { $regex: term, $options: 'i' } },
            { College: { $regex: term, $options: 'i' } },
            { Description: { $regex:  term, $options: 'i' } },
            { Domain: { $regex:  term, $options: 'i' } },
            { Comments: { $regex:  term, $options: 'i' } }
            
        ],
        
    });
    const term1= await projects.find({ $text: { $search: tokens.join(' ') } });
    let combinedResults1 = [...term1];

    partialSearchResults.forEach(result => {
        if (!combinedResults1.some(item => item._id.equals(result._id))) {
            combinedResults1.push(result);
        }
    });

    
    res.json(combinedResults1);
   
};

//return proects by domain
const getDomainProjects = async (req, res) => {
    const term = req.query.term;
    const term1= await projects.find({Domain:term});
    res.json(term1);
};

//return liked projects
const getlikedprojects = async (req, res) => {
    const mail = req.session.loggedInemail
    const term1= await Course.findOne({email_address:mail}).select('likes');
    const list = term1.likes
    let objectidlist = list.map(id => new mongoose.Types.ObjectId(id));
    const listo = await projects.find({_id:{$in:objectidlist}})
    res.json(listo);
};
//return student details
const getstudentdetails=async(req,res)=>
{
    const user=req.session.loggedInemail;
    const search=await Course.findOne({email_address:user});
    res.json(search);
}

//returns projects made by specific student
const getstudentproject=async(req,res)=>
{
    const email=req.session.loggedInemail;
    const search=await Course.findOne({email_address:email});
    const user=search.projects;
    const sugesstion = await projects.find({_id: user });
    res.json(sugesstion);


}

//returns project data from id
const getprojectdata = async(req,res)=>{
    const data =req.body.data;
    const projId = new mongoose.Types.ObjectId(data);
    const projinfo = await projects.findOne({_id:projId});
    res.json(projinfo)
}

//add comment
const addcomment = async(req,res)=>{
    const {projid,commentdata} = req.body;
    mail=req.session.loggedInemail
    const Daate = new Date()
    const projId = new mongoose.Types.ObjectId(projid);
    const projinfo = await projects.findOne({_id:projId});
    let comments = projinfo.Comments
    if (req.session.typeofuser===0){
        const stuinfo = await Course.findOne({email_address:mail})
        const naame = stuinfo.student_name
        const photo = stuinfo.photo
        comments.push({id:stuinfo._id,studentname:naame,Date:Daate,comment:commentdata})
        projinfo.Comments=comments
        projinfo.save()
    }
    else{
        const stuinfo = await recruiter.findOne({email_address:mail})
        const naame =  stuinfo.hr_name
        const photo = stuinfo.photo
        comments.push({id:stuinfo._id,photoid:photo,studentname:naame,Date:Daate,comment:commentdata})
        projinfo.Comments=comments
        projinfo.save()
    }
    res.json("success")
}
const deletecomment = async(req,res)=>{
    const {index,id} = req.body;
    const projinfo = await projects.findOne({_id:id})
    let comments = projinfo.Comments
    if(index===0){
        comments.pop()
    }
    else{
        comments.splice(index,index);
    }
    projinfo.Comments=comments
    projinfo.save()
    res.json('success')
}

//get project by skills
const getskillproject = async (req, res) => {
    const term = req.query.term;
    const regex = RegExp(term, 'i');
    const result = await projects.find({Skills:regex});
    res.json(result);
};

const getskillList = async (req, res) => {
    const term = req.query.term;
    const term1 = term.split((","))
    //console.log(term1);
   // console.log(typeof term1);
    const result = await projects.find({Skills:{$all:term1}});
    //console.log(result);
    res.json(result);
};

//random projects

  const getmostlikedprj= async (req, res) => {
    const topProjects = await projects.find({}).sort({ Likes: -1 }).limit(5);
    res.json(topProjects);
   
  };

  //add like
  const addlike = async(req,res)=>{
    const mail = req.session.loggedInemail;
    const id = req.body.data;
    const oid = new mongoose.Types.ObjectId(id);
    const nooflikes=await projects.findOne({_id:oid});
    nooflikes.Likes=nooflikes.Likes+1;
    await nooflikes.save();
    const user = await Course.findOne({email_address:mail})
    const list = user.likes
    list.push(oid);
    user.likes=list;
    user.save()
    res.json("success")
}
const removelike = async(req,res)=>{
    const mail = req.session.loggedInemail;
    const id = req.body.data;
    const oid = new mongoose.Types.ObjectId(id);
    const nooflikes=await projects.findOne({_id:oid});

    nooflikes.Likes=nooflikes.Likes-1;
   
    await nooflikes.save();
    const user = await Course.findOne({email_address:mail})
    const list = user.likes
    var index = list.indexOf(oid);
    list.splice(index, 1);
    user.likes=list;
    user.save()
    res.json("success")
}
const checklike= async(req,res)=>{
    const mail = req.session.loggedInemail;
    const id = req.body.data;
    const oid = new mongoose.Types.ObjectId(id);
    const user = await Course.findOne({email_address:mail})
    const list = user.likes
    res.json(Number(list.includes(oid)))
}
const getrecentprj= async (req, res) => {
   
    const topProjects = await projects.find({}).sort({ Date: -1 }).limit(5);
    res.json(topProjects);
   
  };
  const getcollegeprojects = async (req, res) => {
    try {
        const college = req.session.loggedInCollege;
        const term = req.query.term;
        
        const startOfYear = new Date(`${term}-01-01T00:00:00.000Z`);
        const endOfYear = new Date(`${parseInt(term) + 1}-01-01T00:00:00.000Z`);

        const projectsData = await projects.find({
            College: college,
            Date: { $gte: startOfYear, $lt: endOfYear }
        });

        
        const allMonths = Array.from({ length: 12 }, (_, index) => ({
            month: new Date(`${term}-${index + 1}-01`).toLocaleString('en-US', { month: 'long' }),
            projectsCount: 0,
            

        }));

        
        projectsData.forEach(project => {
            const month = project.Date.getMonth() + 1;
            allMonths[month - 1].projectsCount += 1;
            
        });

        
        res.json(allMonths);
    } catch (error) {
        console.error('Error fetching college projects:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getcollegedomainprojects = async (req, res) => {
    try {
        const college = req.session.loggedInCollege;
        const term = req.query.term;

        const startOfYear = new Date(`${term}-01-01T00:00:00.000Z`);
        const endOfYear = new Date(`${parseInt(term) + 1}-01-01T00:00:00.000Z`);

        const projectsData = await projects.find({
            College: college,
            Date: { $gte: startOfYear, $lt: endOfYear }
        });

        const domainCounts = {};

        projectsData.forEach(project => {
            const domain = project.Domain;
            domainCounts[domain] = (domainCounts[domain] || 0) + 1;
        });

        const result = Object.entries(domainCounts).map(([domain, projectsCount]) => ({
            domain,
            projectsCount
        }));
        

        res.json(result);
    } catch (error) {
        console.error('Error fetching college projects:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const gethrdetails=async(req,res)=>
{
    const hr=req.session.loggedInemail;
    const info=await recruiter.findOne({email_address:hr});
   
    res.json(info);
}
const getCollDetails=async(req,res)=>
{
    const name=req.session.loggedInemail;
    const clg=await college.findOne({email_address:name});
    
    res.json(clg);
}

const  getSearchProjectscollege=async(req,res)=>
{
    const name=req.session.loggedInCollege;
    const term=req.query.term;
    const tokens=tokenizer.tokenize(term);
    const partialSearchResults = await projects.find({ 
        $or: [
            { Project_Name: { $regex: term, $options: 'i' } },
            
            { Description: { $regex:  term, $options: 'i' } },
            { Domain: { $regex:  term, $options: 'i' } },
            { Comments: { $regex:  term, $options: 'i' } }
            
        ],
        $and: [
            { College: name }
        ]
    });
    const term1 = await projects.find({$and: [ { $text: { $search: tokens.join(' ') } },{ College: name }]});
    

    let combinedResults1 = [...term1];

    partialSearchResults.forEach(result => {
        if (!combinedResults1.some(item => item._id.equals(result._id))) {
            combinedResults1.push(result);
        }
    });

    
    res.json(combinedResults1);
    
}
const getNoofprojects=async(req,res)=>
{
    const college=req.session.loggedInCollege;
    const term=req.query.term;
    const startOfYear = new Date(`${term}-01-01T00:00:00.000Z`);
    const endOfYear = new Date(`${parseInt(term) + 1}-01-01T00:00:00.000Z`);
    const projectsData = await projects.find({College: college,Date: { $gte: startOfYear, $lt: endOfYear }});
    const total=projectsData.length;
    res.json(total);

}
const hrmainsearch = async (req, res) => {
    const { type, search } = req.query;
    //console.log("Search term:", search);
    //console.log("Type:", type);

    

    if (type === "Student Search") {
        const name = tokenizer.tokenize(search);
        const regex = new RegExp(name.join('|'), 'i');
        const search1 = await Course.find({ $text: { $search: name.join(' ') } });
       
        const searchResultsRegex = await Course.find({ 
            $or: [
                { student_name: { $regex: regex } },
                { email_address: { $regex: regex } },
                { field_name: { $regex: regex } },
                { Description: { $regex: regex } }                
            ]
        });
        
        let combinedResults = [];

        combinedResults.push(...search1);

        searchResultsRegex.forEach(result => {
            if (!combinedResults.some(item => item._id.equals(result._id))) {
                combinedResults.push(result);
            }
        });

        res.json(combinedResults);
    } 
        else if (type === "Project Search") {
            console.log("Entered 'Project Search' condition");
        
            const tokens = tokenizer.tokenize(search);
            
        
           
            const partialSearchResults = await projects.find({ 
                $or: [
                    { Project_Name: { $regex: search, $options: 'i' } },
                    {College: { $regex: search, $options: 'i' } },
                    { Description: { $regex:  search, $options: 'i' } },
                    { Domain: { $regex:  search, $options: 'i' } },
                    { Comments: { $regex: search, $options: 'i' } }
                    
                ],
                
            });
            
            const term1 = await projects.find({ $text: { $search: tokens.join(' ') } });
        
            let combinedResults1 = [...term1];
        
            partialSearchResults.forEach(result => {
                if (!combinedResults1.some(item => item._id.equals(result._id))) {
                    combinedResults1.push(result);
                }
            });
        
            
            res.json(combinedResults1);
        }
        
    
    };

const getbookmarks = async (req,res)=>{
    const mail = req.session.loggedInemail;
    const search = await recruiter.findOne({email_address:mail}).select('bookmarks')
    const list = search.bookmarks;
    const array = []
    for(let key in list){
        let key1 = list[key];
        let stuId = new mongoose.Types.ObjectId(key1);
        let stuinfo = await Course.findOne({_id:stuId});
        array.push(stuinfo)
    }
    res.json(array)
}  

module.exports = {
    getdata,
    projectlist,
    image,
    commentimage,
    getstudata,
    getprojectdata,
    fetchprojdata,
    addbookmark,
    removebookmark,
    checkbookmark,
    validateurl,
    getDomainProjects,
    getSearchProjects,
    getstudentdetails,
    getstudentproject,
    addcomment,
    deletecomment,
    getskillproject,
    getmostlikedprj,
    addlike,
    removelike,
    checklike,
    getskillList,
    getlikedprojects,
    getrecentprj,
    collegeprojdisplay,
    getcollegeprojects,
    getcollegedomainprojects,
    gethrdetails,
    getCollDetails,
    getSearchProjectscollege,
    getNoofprojects,
    hrmainsearch,
    getbookmarks,
};