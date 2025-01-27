import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Filter from './Filter';

const Home = () => {

    const dispatch = useDispatch();

    // useEffect(() => {
    //     const fetchVideos = async () => {

    //         try {
                
    //             const response = await axios.get('http://localhost:4000/videos');
    
    //             if(response.status === 200){
                    
    //             }

    //         } catch (error) {
                
    //         }
    //     }

    //     fetchVideos();

    // }, []);

  return (
    <>
        <Filter/>
    </>
  )
}

export default Home;