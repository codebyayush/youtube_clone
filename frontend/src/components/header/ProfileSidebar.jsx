import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { handleLogout } from "../../store/slices/authSlice";
import axios from "axios";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";


const ProfileSidebar = ({ setEnabled }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getChannel = async () => {
      try {
        const result = await axios.get("http://localhost:4000/getChannel", {
          withCredentials: true,
        });
    
        console.log("RESULT FROM GETCHANNEL---", result);
    
        if (result.status === 200 && result.data && result.data.result) {
          // dispatch(setChannel(result.data.result));
        } else {
          console.error("Invalid response data");
        }
      } catch (error) {
        console.error("Error fetching channel:", error);
      }
    };

    getChannel();
  }, []);


  //logging out the user
  const onLogout = async () => {
    try {
      const result = await axios.get("http://localhost:4000/logout", {
        withCredentials: true,
      });

      if (result.status === 200) {
        dispatch(handleLogout());
      }
      console.log("successfully logged out");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };


  return (
    <>
      <div className="fixed top-16 left-0 w-full h-full flex justify-end bg-gray-500 bg-opacity-40 z-50" onClick={() => setEnabled()}>
        <div className="bg-white p-2 w-52 rounded-lg shadow-md h-fit mt-1 mr-2">
          <ul>
            <li className="font-medium rounded-md hover:bg-gray-200 p-2 cursor-pointer">
              Channel name
            </li>
            <li onClick={() => navigate("/createChannel")} className="font-medium rounded-md hover:bg-gray-200 p-2 cursor-pointer">
              Create Channel
            </li>
            <li className="font-medium rounded-md pl-1">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md mt-2"
                onClick={() => {
                  onLogout();
                  setEnabled();
                }}
              >
                <span className="flex gap-2">
                  Logout <LogOut />
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default ProfileSidebar;
