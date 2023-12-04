import mongoose, { Document, Schema } from "mongoose";

export interface User {
  username: string;
  activeRoomId: string;
}

const userSchema = new Schema<User & Document>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    activeRoomId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<User & Document>("User", userSchema);

export default UserModel;
