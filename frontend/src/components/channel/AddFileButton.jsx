import React from "react";

const AddFileButton = ({submitHandler, onChangeHandler, fileName}) => {

    return (
        <>
          <form onSubmit={submitHandler} className="flex flex-col space-y-2">
            <input
              onChange={onChangeHandler}
              type="file"
              name="videoFile"
              id="file"
              accept="video/*"
              className="hidden"
            />
            <div className="flex items-center gap-2">
                <label
                htmlFor="file"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition duration-300 text-center"
            >
                Choose Video
            </label>
            {fileName && (
                <span className="text-gray-700 ">{fileName.name}</span>
            )}
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-800 transition duration-300"
            >
              Upload Video
            </button>
          </form>
        </>
      );
};

export default AddFileButton;
