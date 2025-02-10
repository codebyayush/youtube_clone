import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { handleLogout } from '../../store/slices/authSlice';
import axios from 'axios';

const Profile = () => {

  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const dispatch = useDispatch();

  const [sidebarToggle, setSidebarToggle] = useState(false); 

  //logging out the user
  const onLogout = async () => {

    try {
      const result = await axios.get("http://localhost:4000/logout", {
        withCredentials: true
      });

      if(result.status === 200){
        dispatch(handleLogout());
      }
      console.log("successfully logged out");
      
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }


  return (
    <>
    <div className='flex justify-end pr-12'>

      <div className="w-52 items-center pt-32 bg-gray-100 shadow-md">
        <span className="text-xl font-semibold">Channel Name</span>
        {isLoggedIn && <button onClick={onLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Logout
        </button>}
      </div>
    </div>
    </>
  );
}

export default Profile;
