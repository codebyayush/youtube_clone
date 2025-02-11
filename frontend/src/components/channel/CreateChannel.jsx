import React, { useRef } from "react";
import { CircleUserRound } from "lucide-react";

const CreateChannel = () => {
  const channelNameRef = useRef();
  const descRef = useRef();

  //creating a new channel
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("files value---", e.target[0].files);

    let baseUrl = null;
    await convertToBase64(e.target[0].files[0]).then((result) => {
      console.log("base64 result---", result);

      baseUrl = result;
    });

    // const addChannel = await axios.post("http://localhost:4000/createChannel", {
    //   channelName: channelNameRef.current.value,
    //   channelBanner: e.target[1].files[0],
    //   description: e.target[2].value,
    //   subscribers: 0,
    // }, {
    //   withCredentials: true
    // });

    // console.log("addChannel result--", addChannel);

    // if(addChannel.status === 200){
    //   console.log("channel created successfully");
    // }
  };

  return (
    <>
      <div className="fixed top-16 left-0 w-full h-full flex justify-center bg-gray-300">
        <div className="flex flex-col w-full items-center border border-black justify-center h-screen dark ">
          {/* main div */}
          <div className="w-1/2 screen-max-7:w-full screen-max-7:h-fit screen-max-7:mt-2 screen-max-4:mt-44 -mt-44 bg-gray-800 rounded-lg shadow-2xl p-6">
            <h2 className="text-2xl font-bold text-gray-200 mb-4 text-center">
              Create Channel
            </h2>
            {/* form */}
            <form
              className="flex flex-col screen-max-7:overflow-y-scroll"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col items-center">
                <CircleUserRound className="text-white h-32 w-32" />
                <div className="grid w-full mt-2 max-w-xs items-center gap-1.5">
                  <input
                    id="picture"
                    type="file"
                    accept="image/*"
                    className="flex h-10 w-full mb-4 rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium"
                    required
                  />
                </div>
              </div>
              <input
                placeholder="Channel Name"
                className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                type="text"
                ref={channelNameRef}
                required
              />

              <textarea
                placeholder="About Channel"
                className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                name="Description"
                ref={descRef}
              ></textarea>

              <button
                className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150"
                type="submit"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateChannel;

//saving the image in base64 format
function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}
