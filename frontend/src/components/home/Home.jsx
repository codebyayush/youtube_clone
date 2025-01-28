import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Filter from './Filter';

const Home = () => {

    const dispatch = useDispatch();
  

  return (
    <>
        <Filter/>

      <h1 className='text-3xl p-20'>home component</h1>
    </>
  )
}

export default Home;