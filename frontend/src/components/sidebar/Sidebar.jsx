import React, { createContext } from "react";
import { X, LogOut, Menu } from "lucide-react";

const SidebarContext = createContext();

const Sidebar = ({ children, ...props }) => {
  const { isOpenHandler, isVisible } = props;

  return (
    <>
    {/* conditionally rendering the sidebar if the screen is less than 700px it'll be hidden otherwise icons will be shown */}
      <aside
        className={`h-screen fixed screen-max-7:fixed overflow-hidden transition-all duration-300 ${
          isVisible ? "w-64" : "w-[78px]"
        } screen-max-7:${isVisible ? "w-64" : "w-0"} bg-white `}

      >
        <nav className="h-full flex flex-col ">
            <div className="w-full flex justify-end h-fit mt-5">
              <Menu
                size={40}
                className="cursor-pointer mr-3"
                onClick={() => {
                  isOpenHandler();
                }}
              />
            </div>
          <ul className={`flex-1 p-3 mt-5`}>{children}</ul>
          <hr className="mx-3 my-3 " />
          <button
            className="flex gap-3 px-3 pb-3 hover:bg-gray-200 mb-3 items-center py-2 font-medium rounded-md cursor-pointer bg-white mx-2"
          >
            <LogOut className="mt-1" />
            {isVisible && <p className="text-xl">Logout</p>}
          </button>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

// this component will hold all the list items which we'll use to filter
// out the videos
export const SidebarItem = ({ icon, text, active, isVisible }) => {
  return (

    <li
      className={`mb-3 flex gap-3 items-center py-2 px-3 font-medium rounded-md cursor-pointer transition ${
        active ? "bg-gray-400" : "bg-white hover:bg-gray-200"
      }`}
    >
      {icon}
      {/* Conditionally render the text based on the isOpen prop */}
      {isVisible && <span>{text}</span>}
    </li>
  );
};
