import React, { createContext } from "react";
import { X, LogOut } from "lucide-react";

const SidebarContext = createContext();

const Sidebar = ({ children, ...props }) => {
  const { isOpenHandler, isVisible } = props;

  return (
    <>
      <aside
        className={`h-screen w-64 z-10 transition-transform duration-300 ${
          isVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="h-full flex flex-col bg-white border-r shadow-md">
          <div className="w-full flex justify-end h-fit mt-2">
            <X
              size={40}
              className="cursor-pointer mr-3"
              onClick={() => {
                isOpenHandler();
              }}
            />
          </div>
          <ul className={`flex-1 p-3 mt-5`}>{children}</ul>

          <hr className="mx-3 my-3 " />
          
          <button className="flex gap-3 px-3 pb-4">
            <LogOut className="mt-1" />
            <p className="text-xl">Logout</p>
          </button>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

// this component will hold all the list items which we'll use to filter
// out the videos
export const SidebarItem = ({ icon, text, active }) => {
  return (
    <li
      className={`mb-3 flex gap-3 items-center py-2 px-3 font-medium rounded-md cursor-pointer ${
        active ? "bg-gray-400" : "bg-white hover:bg-gray-200"
      }`}
    >
      {icon}
      <span>{text}</span>
    </li>
  );
};
