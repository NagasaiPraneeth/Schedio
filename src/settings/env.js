const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

const loginSchema = new mongoose.Schema({
    student_name : String,
    email_address : String,
    password : String,
    field_name:String,
    college_name:String,
    photo:ObjectId,
    projects:[ObjectId],
    Description:String,
    skills:[String],
    Domains:[String],
    likes:[ObjectId],
},{ versionKey: false });
const collegeSchema = new mongoose.Schema({
    college_name: String,
    email_address: String,
    password:String,
  },{ versionKey: false });
const hrSchema = new mongoose.Schema({
    hr_name : String,
    photo : ObjectId,
    email_address : String,
    password : String,
    company_name:String,
    bookmarks:[ObjectId]
},{ versionKey: false });
const departmentSchema=new mongoose.Schema({
    field_name:String,
},{ versionKey: false });
const companySchema=new mongoose.Schema({
    company_name:String,
},{ versionKey: false });
const projectschema = new mongoose.Schema({
    Domain:String,
    Skills:Array,
    College:String,
    Project_Name:String,
    Likes:Number,
    Description:String,
    Date:Date,
    photo:ObjectId,
    Video:ObjectId,
    Comments:Array,
    Students:Array,
    photos:Array,
    File:ObjectId
},{ versionKey: false });
const skillSchema=new mongoose.Schema({
    skill_name:String,
},{ versionKey: false });

const Course = mongoose.model('student', loginSchema);
const recruiter = mongoose.model('head_recruiter', hrSchema);
const college=mongoose.model('college',collegeSchema);
const Department =mongoose.model('feild',departmentSchema);
const companies =mongoose.model('companie',companySchema);
const projects = mongoose.model('project',projectschema);
const skills=mongoose.model('skill',skillSchema);

module.exports = {
    Course:Course,
    college:college,
    Department:Department,
    projects:projects,
    recruiter:recruiter,
    companies:companies,
    skills:skills,
}