import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/userModel.js";
import { authService } from "../services/authservice.js";

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if ([username, email, password].some((field) => field?.trim() === "")) {
        throw new apiError(400, "All fields are required");
    }

    const createdUser = await authService.registerNewUser({ username, email, password });
    
    return res.status(201).json(
        new apiResponse(201, createdUser, "User registered successfully")
    );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new apiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new apiError(404, "User with this email does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new apiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await authService.generateTokens(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = { httpOnly: true, secure: process.env.NODE_ENV === 'production' };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(200, { user: loggedInUser, accessToken }, "User logged in successfully")
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
    const options = { httpOnly: true, secure: process.env.NODE_ENV === 'production' };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new apiResponse(200, {}, "User logged out successfully"));
});

export { registerUser, loginUser, logoutUser };