import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { filterByTag } from '../../store/slices/videoSlice';

const Filter = () => {

  const dispatch = useDispatch();
  const videos = useSelector((state) => state.video.videos);

  const onClickHandler = (e) => {
    e.preventDefault();
    console.log(typeof e.target.textContent);
    dispatch(filterByTag(e.target.textContent));
  };

  return (
    <>
         <div className="flex space-x-4 overflow-x-auto p-4 min-w-44 bg-white sticky top-0 z-10">
          <button className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300" onClick={onClickHandler}>All</button>
          <button className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300" onClick={onClickHandler}>Music</button>
          <button className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300" onClick={onClickHandler}>Comedy</button>
          <button className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300" onClick={onClickHandler}>Entertainment</button>
          <button className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300" onClick={onClickHandler}>Education</button>
          <button className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300" onClick={onClickHandler}>Gaming</button>
          <button className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300" onClick={onClickHandler}>Sports</button>
        </div>
    </>
  )
}

export default Filter;