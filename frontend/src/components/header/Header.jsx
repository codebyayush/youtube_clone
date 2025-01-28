import React, { useState } from "react";
import { FaRegBell, FaVideo } from "react-icons/fa";
import Sidebar, { SidebarItem } from "../sidebar/Sidebar";
import {
  History,
  Home,
  ThumbsUp,
  User,
  TvMinimalPlay,
  VideotapeIcon,
  LogIn,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";



const Header = () => {

  const isLogin = useSelector((state) => state.auth.isLoggedIn);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // for sidebar
  const [isOpen, setIsOpen] = useState(false);

  const isOpenHandler = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
    <div className="flex w-full fixed justify-between bg-white px-6 py-3 screen-max-7:flex-col screen-max-7:items-center screen-max-7:gap-5">
        {/* icon and hamburger */}
        <div className="flex gap-10 screen-max-9:gap-6">
          <button onClick={() => setIsOpen(!isOpen)}>
            <img
              src="/hamburger.png"
              alt="hamburger menu"
              className="h-6 w-6 mt-1 "
            />
          </button>

          <div className="flex gap-2 mt-1 cursor-pointer" onClick={() => navigate("/")}>
            <img src="/youtube.png" alt="youtube icon" className="h-9 w-9 " />
            <h1 className="font-medium text-2xl ">YouTutor</h1>
          </div>
        </div>

        {/* search bar + icon */}
        <div className="flex w-1/3 screen-max-7:w-3/4">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-200 py-2 px-4 border border-gray-400 w-full rounded-full"
          />
          <div className="h-10 w-10 -ml-12 border-l border-gray-400">
            <img
              src="/search.png"
              alt="search icon"
              className="h-6 w-6 mt-2 ml-2"
            />
          </div>
        </div>

        {/* conditional rendering signin button & icons */}
        <div className="flex gap-7 screen-max-9:gap-4 mt-3">
          {isLogin ? (
          <>
          <FaVideo className="w-5 h-5 transition-transform duration-300 hover:scale-125 " />
          <FaRegBell className="w-5 h-5 transition-transform duration-300 hover:scale-125" />
            <User className="w-5 h-5 transition-transform duration-300 hover:scale-125"/>
          </>
          ): <div onClick={() => navigate("/login")} className="flex gap-2 rounded-full cursor-pointer hover:bg-gray-200 px-3 -mt-2"><h1 className="text-lg mt-[4px] cursor-pointer">Sign In</h1><LogIn className="mt-2 screen-max-7:mt-0"/></div>}
        </div>
      </div>

      {/* sidebar component */}
      <Sidebar isOpenHandler={isOpenHandler} isVisible={isOpen}>
        <SidebarItem icon={<Home />} text="Home" isVisible={isOpen}/>
        <SidebarItem icon={<VideotapeIcon />} text="Your Videos" isVisible={isOpen}/>
        <SidebarItem icon={<TvMinimalPlay />} text="Subscribed Channel" isVisible={isOpen}/>
        <SidebarItem icon={<History />} text="History" isVisible={isOpen}/>
        <SidebarItem icon={<ThumbsUp />} text="Liked" isVisible={isOpen}/>
      </Sidebar>
    </>
  );
};

export default Header;
