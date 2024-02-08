import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jwt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      lowecase: true,
      unique: true,
      trim: true,
      index: true,
      required: true,
    },

    email: {
      type: String,
      lowecase: true,
      unique: true,
      trim: true,
      required: true,
    },

    fullName: {
      type: String,
      required: true,
      lowecase: true,
      unique: true,
      index: true,
    },

    avatar: {
      type: String, // url of the cloudinary link
      required: true,
    },

    coverImage: {
      type: String,
    },

    watchHistory: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// ! this function is basically encrypting the pass and this will do this only if the pass is changedß
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } else {
    return next();
  }
});

// ! this is the method that we are adding in the user schema to see if the pass is correct or not
userSchema.methods.validatePass = async function (pass) {
  return await bcrypt.compare(pass, this.password);
};

// ! generating the access token
userSchema.methods.generateAccesToken = async function () {
  return await jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// ! generating the refresh token
userSchema.methods.generateRefreshToken = async function () {
  return await jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {};

export const User = mongoose.model("User", userSchema);
