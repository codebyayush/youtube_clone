import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import axios from 'axios';

const Filter = () => {

  const dispatch = useDispatch();

  //api to filter tags
  // useEffect(() => {
  //     const fetchTags = async () => {
  //         const tags = await axios.get("http://localhost:4000/tags");

  //         if(tags.status === 200){
            
  //         }
  //     }

  //     fetchTags();
  // }, []);


  return (
    <>
        <div>

        </div>
    </>
  )
}

export default Filter;