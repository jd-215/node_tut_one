import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        addressLine1: {
            type: String,
            required: true,
        },
        addressLine2: {
            type: String,
            required: true,
        },
        pincode: {
            type: String,
            required: true,
        },
        phone: {
            type: Number,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        SpecialiZaation: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export const Hospital = mongoose.model("Hospital", hospitalSchema);
