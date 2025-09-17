import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';
import cookieParser from 'cookie-parser';

// This is a simplified cookie parser for the handshake
const parseCookie = str =>
  str
  .split(';')
  .map(v => v.split('='))
  .reduce((acc, v) => {
    acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
    return acc;
  }, {});


export const authenticateSocket = async (socket, next) => {
    try {
        const cookie = socket.handshake.headers.cookie;
        if (!cookie) {
            return next(new Error("Authentication error: No cookie provided."));
        }

        const cookies = parseCookie(cookie);
        const token = cookies.accessToken;
        
        if (!token) {
            return next(new Error("Authentication error: No token provided."));
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            return next(new Error("Authentication error: User not found."));
        }

        socket.user = user; // Attach user to the socket instance
        next();
    } catch (error) {
        next(new Error("Authentication error: Invalid token."));
    }
};