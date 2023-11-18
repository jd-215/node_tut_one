import mongoose from "mongoose";

const docterSchema = new mongoose.Schema(
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
            type: Number,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        specialization: {
            type: String,
            required: true,
        },
        experience: {
            type: Number,
            required: true,
            default: 0,
        },
        salary: {
            type: Number,
            required: true,
        },
        qualification: {
            type: String,
            required: true,
        },
        worksIn: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Hospital",
            },
        ],
    },
    { timestamps: true }
);

export const Docter = mongoose.model("Docter", docterSchema);
