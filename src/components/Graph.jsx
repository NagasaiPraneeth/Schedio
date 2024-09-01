import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import NothingHere from "./nothinghere";
import ProjectCard from './ProjectCard';
const Graph = ({handleclick,  receivedData, selectedYear, handleYearChange }) => {
    const [suggestions, setsuggestions] = useState([]);
    const [college, setCollege] = useState('');
    const [collegeprj, setCollegePrj] = useState([]);
    const [noofprj,setNoofprj]=useState(0);
    const [domainprj,setDomainprj]=useState([]);

    useEffect(() => {
        getproj();
    }, [receivedData]);

    const getproj = async () => {
        try {
            const response = await axios.post('/en/collegeprojectsdisplay', {receivedData: receivedData});
            
            setsuggestions(response.data.list);
            setCollege(response.data.college);
        } catch (error) {
            console.error("Error fetching projects:", error);
           
        }
    };
    useEffect(()=>
    {
        const getNoofprojects=async(req,res)=>
        {
            const response=await axios.get(`/en/getnoofprj?term=${selectedYear}`);
            const data=response.data;
            setNoofprj(data);
        };
        getNoofprojects();
    },[selectedYear])
    
    
    

    useEffect(() => {
        const handlecollegeprojects = async () => {
            try {
                const response = await axios.get(`/en/getcollegeprojects?term=${selectedYear}`);
                const data = response.data;
                setCollegePrj(data);
            } catch (error) {
                console.error('Error fetching college projects:', error);
                
            }
        };

        handlecollegeprojects();
    }, [selectedYear]);

    useEffect(() => {
        const handledomainprojects = async () => {
            try {
                const response = await axios.get(`/en/getcolldomainprojects?term=${selectedYear}`);
                const data = response.data;
                setDomainprj(data);
            } catch (error) {
                console.error('Error fetching college projects:', error);
                
            }
        };

        handledomainprojects();
    }, [selectedYear]);

    const monthlyChartRef=useRef(null);
    const domainChartRef=useRef(null);
    

useEffect(() => {
    if (!collegeprj) {
        console.warn(`Data for year ${selectedYear} not available yet.`);
        return;
    }


    if (monthlyChartRef.current) {
        monthlyChartRef.current.destroy();
    }

    const ctx = document.getElementById('monthlyChart').getContext('2d');

    monthlyChartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
            labels: collegeprj.map(entry => entry.month),
            datasets: [
                {
                    label: `Number of Projects (${selectedYear})`,
                    borderColor: 'rgba(4, 67, 112, 1)',
                    borderWidth: 2,
                    fill: false,
                    data: collegeprj.map(entry => entry.projectsCount),
                },
            ],
        },
        options: {
            scales: {
                x: {
                    grid: {
                        display: false,
                    },
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false,
                    },
                },
            },
        },
    });
}, [selectedYear, collegeprj]);

useEffect(() => {
    if (!domainprj) {
        console.warn(`Data for year ${selectedYear} not available yet.`);
        return;
    }

    

    if (domainChartRef.current) {
        domainChartRef.current.destroy();
    }

    const ctx = document.getElementById('domainChart').getContext('2d');

    domainChartRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: domainprj.map(entry => entry.domain),
            datasets: [
                {
                    label: `Number of Projects (${selectedYear})`,
                    borderColor: 'rgba(4, 67, 112, 1)',
                    borderWidth: 2,
                    fill: true,
                    backgroundColor : 'rgba(4, 67, 112, 1)',
                    data: domainprj.map(entry => entry.projectsCount),
                },
            ],
        },
        options: {
            scales: {
                x: {
                    grid: {
                        display: false,
                    },
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false,
                    },
                },
            },
        },
    });
}, [selectedYear, domainprj]);
    return (
        <div className="cmaintotal">
            <div className="cmainheading">
                <h2>{college}</h2>
            </div>
            <div id="cmainnp" >
                    <p>{noofprj} projects this year</p>
            </div>
            <div className="cmaingraph">
                <div id="cmainrealgraph" className="justincase">
                    <label htmlFor="yearSelector" className='year'>Select Year:</label>
                    <select id="yearSelector" onChange={handleYearChange} value={selectedYear} >
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                        <option value="2020">2020</option>
                        <option value="2019">2019</option>
                        <option value="2018">2018</option>
                        <option value="2017">2017</option>
                        <option value="2016">2016</option>
                        <option value="2015">2015</option>
                        <option value="2014">2014</option>
                        <option value="2013">2013</option>
                        <option value="2012">2012</option>
                        <option value="2011">2011</option>
                        <option value="2010">2010</option>
                        <option value="2009">2009</option>
                        <option value="2008">2008</option>
                        <option value="2007">2007</option>
                        <option value="2006">2006</option>
                        <option value="2005">2005</option>
                        <option value="2004">2004</option>
                        <option value="2003">2003</option>

                        


                        
                    </select>
                    <div className='myselfanu'>
                    <div className='inmine'><canvas id="monthlyChart"></canvas></div>
                    <div className='inmine'><canvas id="domainChart"></canvas></div>
                    </div>

                </div>
              
            </div>
            <div className="cprojects" >
                {suggestions.map((suggestion, index) => (
                    <div onClick={()=>{handleclick(suggestion._id)}}>

                    <ProjectCard projinfo={suggestion} index={index}/>
                    </div>

                ))}
                {suggestions.length===0 && <NothingHere/>}
            </div>
        </div>
    );
};

export default Graph;
