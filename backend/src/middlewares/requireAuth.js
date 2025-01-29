import jwt from "jsonwebtoken";

// middleware to the check if the user is logged in
// this will attach the current userId in the request object
const requireAuth = (req, res, next) => { 
  // the api is not working with cookies in thunderclient 
  // so I put it in the headers instead
    let token = req.cookies.jwt;

    
    // checking if the token exists or not
    if (!token) {
      res.status(401).json({ msg: "Please log in", error: "Unauthorized" });
      throw new Error("No token provided");
    }

    try { 
      // removing the "Bearer " from the token if it is there
      token = token.replace(/^Bearer\s+/, "");
      console.log("token from requireAuth--",token);

      // verifying the token using the secret to decode its payload
      const data = jwt.verify(token, "chickiwikichicki"); 

      // if the token is valid attach the userId to the request object
      req.userId = data.id;
      console.log("req.userId from requireAuth--", data);

      // calling the next middleware function
      next();
    } catch (error) {
      console.error("Error verifying token:", error);
      res.status(401).json({ msg: "Invalid token", error: "Unauthorized" });
      return;
    }
  };

export default requireAuth;
