import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/fileUpload.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // ! steps to register the user
  // ? 1 take user input from the request
  // ? 2 validation - not empty
  // ? 3 check if the user is already present in the db. if yes, then it is a login and not register process (email and name)
  // ? 4 check for images, check for avatar
  // ? 5 upload them to cloudinary. check for avatar
  // ? 6 create a user object - create entry in db
  // ? 7 remove pass and refresh token
  // ? 8 return the response with user registration successful message

  // ? 1 take user input from the request
  const { fullName, password, email, username } = req.body;

  // ? 2 validation - not empty
  if (
    [username, email, password, fullName].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are   required.");
  }

  // ? 3 check if the user is already present in the db. if yes, then it is a login and not register process (email and name)
  const existedUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existedUser) {
    throw new ApiError(
      409,
      "User with email or username is already registered!"
    );
  }

  // ? 4 check for images, check for avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;

  let coverLocalPath = "";
  if (
    req.files &&
    Array.isArray(req.files.cover) &&
    req.files.cover.length > 0
  ) {
    coverLocalPath = req.files.cover[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "User avatar required!");
  }

  // ? 5 upload them to cloudinary. check for avatar
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const cover = await uploadOnCloudinary(coverLocalPath);

  if (!avatar) {
    throw new ApiError(500, "Error in uploading image to the server");
  }

  // ? 6 create a user object - create entry in db
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    cover: cover?.url || "",
    username: username.toLowerCase(),
    email,
    password,
  });

  // ? 7 remove pass and refresh token
  const createdUser = await User.findById(user?._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong in creating a user");
  }

  // ? 8 return the response with user registration successful message
  res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

export { registerUser };
