import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
            required: true,
        },
        gender: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        dignosedWith: {
            type: String,
            required: true,
        },
        bloodGroup: {
            type: String,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            enum: ["MALE", "FEMALE", "OTHER"],
            required: true,
        },
        addmittedIn: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hospital",
        },
    },
    { timestamps: true }
);

export const Patient = mongoose.model("Patient", patientSchema);
