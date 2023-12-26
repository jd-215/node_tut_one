import mongoose, { Schema } from "mongoose";

// The provided code defines a Mongoose schema for a subscription
//  model with two fields that reference the "User"
//  model, and exports the model as "Subscription".

const subscriptionSchema = new Schema(
      {
            subscriber: {
                  type: Schema.Types.ObjectId, // subscription id
                  ref: "User",
            },
            channel: {
                  type: Schema.Types.ObjectId,
                  ref: "User",
            },
      },
      { timestamps: true }
);

export const Subscription =
      mongoose.model.subscriptionSchema ||
      mongoose.model("Subscription", subscriptionSchema);
