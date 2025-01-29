import jwt from "jsonwebtoken";
const secret = "chickiwikichicki";

const maxAge = 60 * 60;

//to create jwt token using id
export const createToken = (id) => {
    return jwt.sign(id, secret, {expiresIn: maxAge});
};