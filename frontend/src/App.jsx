import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/header/Header'
import ChannelPage from './components/channel-page/ChannelPage'
import Home from './components/home/Home'
import Auth from './components/authentication/Auth'
import { addAllVideos } from './store/slices/videoSlice'
import { useDispatch } from 'react-redux'
import axios from 'axios'

function App() {
  
  const dispatch = useDispatch();

  //this will fetch all the videos from db and push it to the redux videos array
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const result = await axios.get("http://localhost:4000/fetchAllVideos");

        console.log("fetched videos:-", result);

        if (result.status === 200) {
          dispatch(addAllVideos(result.data.result));
          return console.log("fetch successful");
        }
      } catch (error) {
        console.log("Error fetching videos--", error);
      }
    };

    fetchAll();
  }, []);


  return (
   <>
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/channelpage' element={<ChannelPage/>}/>
          <Route path="/login" element={<Auth />}/>
        </Routes>
      </BrowserRouter>
   </>
  )
}

export default App;