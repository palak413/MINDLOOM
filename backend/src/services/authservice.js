// src/services/auth.service.js
import { User } from '../models/userModel.js';
import { Plant } from '../models/plantModel.js';
import { apiError } from '../utils/apiError.js';

/**
 * Creates a new user and their initial plant.
 * @param {object} userData - Contains username, email, and password.
 * @returns {Promise<User>} The created user document.
 */
const registerNewUser = async (userData) => {
    const { username, email, password } = userData;

    // Check if user already exists
    const existedUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existedUser) {
        throw new apiError(409, "User with email or username already exists");
    }

    // Create user
    const user = await User.create({
        username: username.toLowerCase(),
        email,
        password,
    });

    // Create a plant for the new user
    await Plant.create({ user: user._id });

    // Refetch to ensure data is clean before returning
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        throw new apiError(500, "Something went wrong while registering the user");
    }

    return createdUser;
};

/**
 * Generates and saves access and refresh tokens for a user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<{accessToken: string, refreshToken: string}>}
 */
const generateTokens = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new apiError(404, "User not found");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
};


export const authService = {
    registerNewUser,
    generateTokens,
};