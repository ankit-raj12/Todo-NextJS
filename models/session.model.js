import mongoose, { Schema } from "mongoose";

const Session =
  mongoose.models.session ||
  mongoose.model("session", {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      expires: 7 * 24 * 60 * 60,
    },
  });

export default Session;
