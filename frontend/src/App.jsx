import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/header/Header'
import ChannelPage from './components/channel-page/ChannelPage'
import Home from './components/home/Home'
import Auth from './components/authentication/Auth'


function App() {

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