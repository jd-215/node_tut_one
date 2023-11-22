import mongoose, {Schema} from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true // think before you add this buecause it will affect the performance but it will contribute to the fast query
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
        required: true
    },
    coverImage: {
        type: String, // cloudnary to store the image in bucket
        
    },
    watchHistory: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    refreshToken: {
        type: String,
    },

}, {timestamps: true});


UserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        return next();
    } 
        
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
})

UserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

UserSchema.methods.generateToken = async function () {
    return jwt.sign({
         _id: this._id ,
        email: this.email,
        fullName: this.fullName,
        userName: this.userName,
         }, 
         process.env.ACCESS_TOKEN_SECREAT, {
        expiresIn: process.ACCESS_TOKEN_EXPIRY
    });
}

UserSchema.methods.generateRefreshToken = async function () {
    return jwt.sign({
         _id: this._id ,
         }, 
         process.env.REFRESH_TOKEN_SECREAT, {
        expiresIn: process.REFRESH_TOKEN_EXPIRY
    });
}


export const User = mongoose.model("User", UserSchema)