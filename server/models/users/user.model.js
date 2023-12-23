import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Imports necessary modules: mongoose for MongoDB database operations, Schema from mongoose for defining the schema,
// jwt for JSON Web Token operations, and bcryptjs for password hashing.

// Defines the UserSchema using the Schema object from mongoose. The schema includes fields for username, email, fullName,
//  avatar, coverImage, watchHistory, password, and refreshToken. Some fields have specific requirements such as being required,

//   unique, lowercase, or having a reference to the "Video" model.
// Defines a pre-save middleware function that hashes the user's password before saving it to the database using bcryptjs.

// Defines two methods on the schema:
// isPasswordCorrect: A method that compares a provided password with the user's hashed password using bcryptjs.compare.
// generateToken: A method that generates a JSON Web Token (JWT) containing the user's _id, email, fullName, and userName using jsonwebtoken.sign.

// generateRefreshToken: A method that generates a refresh token containing the user's _id using jsonwebtoken.sign.
// Exports the User model, which is created by calling mongoose.model with the name "User" and the UserSchema.

// -----------------------------------------------------------------------------------------------------------------------

// Define the UserSchema using the Schema object from mongoose.
const UserSchema = new Schema(
      {
            username: {
                  type: String,
                  required: true,
                  unique: true,
                  lowercase: true,
                  trim: true,
                  index: true, // think before you add this buecause it will affect the performance but it will contribute to the fast query
            },
            email: {
                  type: String,
                  required: true,
                  unique: true,
                  lowercase: true,
                  trim: true,
            },
            fullName: {
                  type: String,
                  required: true,
                  trim: true,
            },
            avatar: {
                  type: String, // cloudnary to store the image in bucket
                  required: true,
            },
            coverImage: {
                  type: String, // cloudnary to store the image in bucket
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
      { timestamps: true }
);

// Define a pre-save middleware function that hashes the user's password before saving it to the database using bcryptjs.hash.
UserSchema.pre("save", async function (next) {
      if (!this.isModified("password")) return next();

      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);

      next();
});

// Define a method that compares a provided password with the user's hashed password using bcryptjs.compare.
UserSchema.methods.isPasswordCorrect = async function (password) {
      return await bcrypt.compare(password, this.password);
};

// Generate access token by signing the user's _id using jsonwebtoken.sign.
UserSchema.methods.generateAccessToken = async function () {
      return jwt.sign(
            {
                  _id: this._id,
                  email: this.email,
                  fullName: this.fullName,
                  userName: this.userName,
            },
            process.env.ACCESS_TOKEN_SECRET, // Corrected spelling of ACCESS_TOKEN_SECRET
            {
                  expiresIn: process.env.ACCESS_TOKEN_EXPIRY, // Corrected spelling of ACCESS_TOKEN_EXPIRY
            }
      );
};
// Generate refresh token by signing the user's _id using jsonwebtoken.sign.
UserSchema.methods.generateRefreshToken = async function () {
      return jwt.sign(
            {
                  _id: this._id,
            },
            process.env.REFRESH_TOKEN_SECREAT, // Corrected spelling of REFRESH_TOKEN_SECRET
            {
                  expiresIn: process.env.REFRESH_TOKEN_EXPIRY, // Corrected spelling of REFRESH_TOKEN_EXPIRY
            }
      );
};

// Export the User model by calling mongoose.model with the name "User" and the UserSchema.

export const User = mongoose.models.User || new mongoose.model("User", UserSchema); // User is the name of the model;
