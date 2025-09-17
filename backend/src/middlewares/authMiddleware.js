// src/middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';
import { apiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const authMiddleware = asyncHandler(async (req, _, next) => {
  try {
    // 1. Get token from either cookies or Authorization header
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new apiError(401, "Unauthorized request: No token provided");
    }

    // 2. Verify the token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // 3. Find the user in the database
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      // This could happen if the user was deleted after the token was issued
      throw new apiError(401, "Invalid Access Token: User not found");
    }

    // 4. Attach the user object to the request
    req.user = user;
    next();
  } catch (error) {
    throw new apiError(401, error?.message || "Invalid Access Token");
  }
});