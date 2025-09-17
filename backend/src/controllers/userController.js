// src/controllers/user.controller.js
import { User } from '../models/userModel.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';

const getCurrentUser = asyncHandler(async (req, res) => {
  // The auth middleware has already fetched the user and attached it to req
  // We just need to send it in a standardized response.
  return res
    .status(200)
    .json(new apiResponse(200, req.user, "User details fetched successfully"));
});

const updateUserDetails = asyncHandler(async (req, res) => {
  const { username, email } = req.body;

  if (!username && !email) {
    throw new apiError(400, "At least one field (username or email) is required to update.");
  }

  // Build the update object dynamically
  const updateData = {};
  if (username) updateData.username = username;
  if (email) updateData.email = email;

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: updateData,
    },
    { new: true } // This option returns the updated document
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new apiResponse(200, user, "User details updated successfully"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // 1. Find the user
  const user = await User.findById(req.user?._id);

  // 2. Check if the old password is correct
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new apiError(400, "Invalid old password");
  }

  // 3. Update the password and save
  user.password = newPassword;
  await user.save({ validateBeforeSave: false }); // We save here to trigger the 'pre-save' hook for hashing

  return res
    .status(200)
    .json(new apiResponse(200, {}, "Password changed successfully"));
});

export { 
    getCurrentUser, 
    updateUserDetails, 
    changeCurrentPassword 
};