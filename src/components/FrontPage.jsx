import React, { useEffect, useState } from 'react';
import './frontpage.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faProductHunt } from '@fortawesome/free-brands-svg-icons';
import { useNavigate, Link } from 'react-router-dom';
import { get } from 'mongoose';

const FrontPage = () => {
  const [data, setdata] = useState([])
  const getdata = async () => {
    const response = await axios.get('/en/count')
    setdata(response.data)
  }
  useEffect(() => {
    getdata()
  })
  const navigate = useNavigate()
  useEffect(() => {

    let lastScrollTop = 0;

    const handleScroll = () => {
      const st = window.scrollY;
      const body = document.body;

      if (st > lastScrollTop && st > 0) {
        body.classList.remove('scrolling-up');
      } else {
        body.classList.add('scrolling-up');
      }

      lastScrollTop = st <= 0 ? 0 : st;
    };

    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const target = entry.target;
        const isVisible = entry.isIntersecting;

        if (isVisible) {
          if (!target.classList.contains('jdet') && !target.classList.contains('jdetimage')) {
            target.classList.add('active');
          }
        } else {
          target.classList.remove('active');
        }
      });
    }, { threshold: 0.3 });

    sections.forEach((section) => {
      observer.observe(section);
    });



    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  const handleLogoClick = () => {
    navigate('/');
  };

  const handleTitleClick = () => {
    navigate('/');
  };


  return (
    <div className="fpage1">
      <div className="fheader">
        <header className="fheaderset">
          <div className="fheaderset1">
            <div className="flogo">
              <div className="fflogo">
                {/* <FontAwesomeIcon icon={faProductHunt} style={{color: "#0db1f8"}} /> */}
                <img src='../Plogo.png' style={{ width: '35px', height: 'auto', paddingTop: '17px' }} onClick={handleLogoClick} />
              </div>
              <div className="ftitle" onClick={handleTitleClick}>
                <p>Schedio</p>
              </div>
            </div>
            <div className="fbuttons">
              <button className="fsignup" onClick={() => navigate('/wru')} name='signup'><p>Sign Up</p></button>
              <button className="fsignup" onClick={() => navigate('/SignIn')} name='signin'><p>Sign In</p></button>
            </div>
          </div>
        </header>
      </div>
      <div className="fbodyy">
        <main>
          <div className="section" id="section4">
            <div className="video-container">
              <video autoPlay muted loop id="background-video">
                <source src="../Frontpage.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="text-overlay">
              <div>
                JOIN THE COMMUNITY OF 2500+ STUDENTS
              </div>
              <div className="aaaaa" onClick={() => navigate('/wru')}>
                <p>Create</p>
              </div>
            </div>
          </div>
          <div className="section" id="section1">
            <div className="jdet">
              <div className="jdetimage">
                <img src="https://miro.medium.com/v2/resize:fit:1100/1*YExY4y9dZvm_ZNH4QiRCgg.png" alt="coding-journey" />
              </div>
              <div id="jdetdetail" className="jdetimage">
                <div className="jjjjj">
                  <p>Embark on your coding journey and unleash your creativity by diving into project creation</p>
                  <p>Starting coding is the key to turning your innovative ideas into tangible, real-world projects</p>
                  <p> Embrace the world of programming to bring your imagination to life and make a meaningful impact through your coding endeavors</p>
                </div>
              </div>
            </div>
          </div>
          <div className="section" id="section2">
            <div className="jdet">
              <div id="jdetdetail" className="jdetimage">
                <div className="jjjjj">
                  <p>DEPLOY YOUR PROJECTS</p>
                </div>
              </div>
              <div className="jdetimage">
                <img src="../Deploying.jpg" alt="community-students" />
              </div>
            </div>
          </div>
          <div className="section" id="section3">
            <div className="jdet">
              <div className="jdetimage">
                <img src="../Project-Management.jpg" alt="community-students" />
              </div>
              <div id="jdetdetail" className="jdetimage">
                <div className="jjjjj">
                  <p>LET OTHERS KNOW ABOUT YOUR PROJECTS</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <div className="ffooter">
        <footer className="footer-container">
          <div className="ffele" id="fcreate">
            START DOING YOUR OWN PROJECTS NOW
          </div>
          <div className="ffele" id="ficons">
            <div className="fonline">
              <p>project</p>
              <i className="fab fa-twitter"><Link to='https://twitter.com/neilgogte'>Twitter</Link></i>
              <i className="fab fa-facebook-f"><Link to='https://www.facebook.com/KMiT.in/'>Facebook</Link></i>
              <i className="fab fa-instagram"><Link to='https://www.instagram.com/kmitofficial/?hl=en'>Instagram</Link></i>
              <i className="fab fa-envelope-f"><Link>freemovies5247@gmail.com</Link></i>
            </div>
            <div>
              <p>Students Registered:{data[0]}</p>
            </div>
            <div>
              <p>Colleges Registered:{data[1]}</p>
            </div>
            <div>
              <p>Companies Registered:{data[2]}</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default FrontPage;
