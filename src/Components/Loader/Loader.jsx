import React from 'react'
import "./Loader.scss";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import video from "../../Asset/Loader.mp4"


const Loader = () => {

  const [timeLeft, setTimeLeft] = useState(3);
  const navigate = useNavigate();

  useEffect(() => { //SET TIMER FOR DIRECT ROUTE TO THE LOG....
      const countdown = setInterval(() => {
          setTimeLeft(prevTime => prevTime - 1);
      }, 1600);

      if (timeLeft <= 0) {
          clearInterval(countdown);
          navigate('/log'); 
      }

      return () => clearInterval(countdown);
  }, [timeLeft, navigate]);
  
  return (
    <div className='Content'>
        <video id='loader' src={video} autoPlay muted loop>LOADING....</video>
    </div>
  )
}

export default Loader;