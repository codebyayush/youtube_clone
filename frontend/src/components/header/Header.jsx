import React, { useState } from "react";
import { FaRegBell, FaVideo } from "react-icons/fa";
import Sidebar, { SidebarItem } from "../sidebar/Sidebar";
import {
  History,
  Home,
  ThumbsUp,
  TvMinimalPlay,
  VideotapeIcon,
} from "lucide-react";


const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const isOpenHandler = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
    <div className="flex w-full fixed justify-between bg-white p-2 pl-10 pr-10 screen-max-9:pl-0 screen-max-9:pr-0  screen-max-7:flex-col screen-max-7:items-center screen-max-9:justify-center screen-max-9:gap-5">
        {/* icon and hamburger */}

        <div className="flex gap-10 screen-max-9:gap-6">
          <button onClick={() => setIsOpen(!isOpen)}>
            <img
              src="/hamburger.png"
              alt="hamburger menu"
              className="h-6 w-6 mt-1"
            />
          </button>

          <div className="flex gap-2 mt-1">
            <img src="/youtube.png" alt="youtube icon" className="h-9 w-9" />
            <h1 className="font-medium text-2xl ">YouTutor</h1>
          </div>
        </div>

        {/* search bar + icon */}
        <div className="flex w-1/3 screen-max-7:w-3/4">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-200 py-2 px-4 border w-full rounded-full"
          />
          <img
            src="/search.png"
            alt="search icon"
            className="h-6 w-6 mt-2 -ml-8"
          />
        </div>

        {/* conditional rendering signin button & icons */}
        <div className="flex gap-7 screen-max-9:gap-4 mt-3">
          <FaVideo className="w-5 h-5 transition-transform duration-300 hover:scale-110 " />
          <FaRegBell className="w-5 h-5 transition-transform duration-300 hover:scale-110" />
          <h1 className="rounded-full border border-black bg-blue-500 text-white p-1 -mt-1 transition-transform duration-300 hover:scale-110">
            user
          </h1>
        </div>
      </div>
    
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
