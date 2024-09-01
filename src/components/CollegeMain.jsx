import React, {useState,useEffect,useCallback} from "react";
import CollegeHeader from "./CollegeHeader";
import Graph from "./Graph";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser} from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import "./collegemain.css"
import FiltersCollege from "./FiltersCollege";
import DomainClick from "./DomainClick";
import Collegeprojectportfolio from "./collegeprojectportfolio"
import { Link, useParams, useNavigate, Navigate } from "react-router-dom";
import StudentDataclg from "./StudentDataclg";

const CollegeMain =({checkSession}) => {
    let { projid } = useParams();
    
    useEffect(() => {
        const intervalId = setInterval(async () => {
          try {
            const response = await axios.get("/checksessionexpiry");
            if (response.data === 0) {
                try{
                    clearInterval(intervalId);
                    alert('Session Expired. Please Login again')
                    await checkSession()
                }
                catch(error){
                    console.log(error)
                }
            }
          } catch (error) {
            console.error('Error checking session expiry:', error);
          }
        }, 10000);

    
        return () => clearInterval(intervalId);
      }, [checkSession]);
      
    const [display,setDisplay]=useState(0);
    const [sugesstions,setSugesstions]=useState([]);
    const [sendDataToStudent, setSendDataToStudent] = useState(null);
    const [collegedetail,setCollegedetail]=useState([]);
    const [isProfileVisible,setIsProfileVisible]=useState(false);
    const [stack,setstack]=useState([[0,'Upload Date',false,2024]])
    const [selectedYear, setSelectedYear] = useState('2024');
    const toggleDashboard1 = () => {
        setIsProfileVisible(prevState => !prevState);
    };
    const navigate=useNavigate();
    const handlesearch = async (inputData) => {
        try {
            if (inputData!==''){
                const response = await axios.get(`/en/getsearchbycollege?term=${inputData}`);
                const data=response.data;
                setSugesstions(data);
                setDisplay(1);
                setstack(prevStack => {
                    const newStack = [...prevStack];
                    newStack.push([1,inputData])
                    return newStack;
                    }); 
            }
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };
    const deletesession = async () => {
        try {
            const response = await axios.post("/en/deletesession");
            await checkSession();
        } catch (error) {
            console.error('Error deleting session:', error);
        }
    };
      const [receivedData, setReceivedData] = useState({
        sort_by:'Upload Date',
        order:false
    });
    const handleclick=(data)=>{
        setDisplay(2);
        setSendDataToStudent(data);
        setstack(prevStack => {
            const newStack = [...prevStack];
            newStack.push([2,data])
            return newStack;
            });
    }
    const handlestuclick=(data)=>{
        setDisplay(3)
        setSendDataToStudent(data)
        setstack(prevStack => {
            const newStack = [...prevStack];
            newStack.push([3,data])
            return newStack;
            });
    }
    const FilterData = useCallback((data) => {
        updateReceivedData(data);
    }, []);

    const CategoryData = useCallback((data) => {
        updateReceivedData(data);
    }, []);
    const updateReceivedData = (data) => {
        setReceivedData(prevData => ({ ...prevData, ...data }));
        setstack((prevStack) => {
            const newStack = [...prevStack];
            newStack[0][1] = data.sort_by;
            newStack[0][2] = data.order;
            return newStack;
        });
    };
    const killpage = async() => {
        const len = stack.length
        if (stack[len-2][0]===0){
            setDisplay(0)
            updateReceivedData({
                sort_by:stack[len-2][1],
                order:stack[len-2][2]
            })
            setSelectedYear(stack[len-2][3])
        }
        else if (stack[len-2][0]===1){
            const response = await axios.get(`/en/getsearchbycollege?term=${stack[len-2][1]}`);
            const data=response.data;
            setSugesstions(data);
            setDisplay(1);
        }
        else if (stack[len-2][0]===2){
            setDisplay(2)
            setSendDataToStudent(stack[len-2][1])
        }
        else if (stack[len-2][0]===3){
            setDisplay(3)
            setSendDataToStudent(stack[len-2][1])
        }
        setstack(prevStack => {
            const newStack = [...prevStack];
            newStack.pop();
            return newStack;
          });
    }
    const handlecollegedetail=async()=>
    {
        try{
            const response=await axios.get("/en/getcollegedetails");
            const data=response.data;
            setCollegedetail(data);
        }
        catch(error)
        {
            console.error("error occured:",error);
        }
    }
    const fetchData = async () => {
        try {
            if(projid){
                const response = await axios.get(`/en/validateurl?projid=${projid}`)
                if (response.data===1){
                    handleclick(projid)
                }
                else if(response.data==2){
                    handlestuclick(projid)
                }
                else{
                    navigate('clgmain')
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const handleYearChange = event => {
        setSelectedYear(event.target.value);
        setstack(prevStack => {
            const newStack = [...prevStack];
            newStack[0][3] = event.target.value;
            return newStack;
          });
    };
    useEffect(()=>{
        fetchData()
    },[projid])
    console.log(display,stack)
    return(
        <div className="body1">
        <CollegeHeader takedata={CategoryData} handlesearch={handlesearch} handlecollegedetail={handlecollegedetail} toggleDashboard1={toggleDashboard1}/>
        {display===0 && <FiltersCollege sendDataToParent={FilterData} />}
        <div className={`pbox no-print ${isProfileVisible ? 'unblurred-content' : ''}`} style={{ display: isProfileVisible ? 'block' : 'none' }}>
                    <div className="two">
                        <div className="pp">
                            <div className="pphoto">
                            <FontAwesomeIcon icon={faUser} className="profileset-icon1"/>
                            </div>
        
                        </div>
                        <p>{collegedetail.college_name}</p>
                    </div>
                    <div class="pelement">
                        <div className="para"><p>{collegedetail.email_address} </p></div>
                        <hr/>  
                        <div className="logout" onClick={deletesession}> <p>LogOut<span><i class='fas fa-sign-out-alt'></i></span></p></div>         
                    </div>
            </div>
        <div className={`bodyy1 ${isProfileVisible ? 'blur-background' : ''}`}>
            
 
            
            {display===0 && <Graph receivedData={receivedData} selectedYear={selectedYear} handleYearChange={handleYearChange} handleclick={handleclick} />}
            {display===1 && <DomainClick handleclick={handleclick} handlebackClick={killpage} sugesstions={sugesstions}/>}
            {display===2 && <Collegeprojectportfolio studata={sendDataToStudent} dis={killpage} handlestuclick={handlestuclick}/>}
            {display===3 && <StudentDataclg studata={sendDataToStudent} dis={killpage} handleclick={handleclick}/>}
        </div>
        </div>
    );
}
export default CollegeMain;