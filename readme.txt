This is a youtube clone- Yoututor
NOTE- I have fetched videos from the youtube API and saved them in the yoututor database manually first, using thunderclient extension.
using this API---    router.route("/fetchAndPushVideos").get(fetchDataFromYoutubeAndPushToDb);

--- before running the app, please create database named- yoututor in mongodb and then run this get API using thunderclient.
http://localhost:4000/fetchAndPushVideos


Features:

1. Login/Signup - used JWT authentication, First user needs to create an account and then login to that account, 
            then only they can create their channel, like/dislike, comment on videos.

2. Create Channel - If the user is logged in, then they can create a channel and if the channel is already
            present then they can add videos to the channel, user can only create their channel once.

3. Upload Video - If the user is logged in, then they can upload a video and delete the video from their channel.

4. Like/Dislike Video - If the user is logged in, then they can like or dislike any video.

5. Comment on Video - If the user is logged in, then they can comment on the video, edit and delete their comment from the video.

6. View Channel - If the user is logged in, then they can view their own channel.

7. Search Video - user can search video based on title only on the home page, even if they are not logged in.

8. Filter Video - user can filter video only on the home page, based on given categories.

9. Suggested Videos - user can see suggested videos which are the remaining videos except selected video.

10. View Video - user can click & view video only from the home page.

11. Sidebar - user can click on the hamburger icon to open sidebar and can navigate to home page only.

12. Profile - user can click on the profile icon in the header to open profile sidebar, in which user can logout and visit their channel.

13. Header - Header contains youtube icon, searchbar and profile icon or signIn button based on if the user is logged in or not.

14. Channel icon - user can see their their channel icon and banner in the channel page or in the video player page.

15. Comments - user can see fetched comments and their comments in the video player page.
16. Sidebar Logout - user can click on the logout icon in the sidebar to logout.    
