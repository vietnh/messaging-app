import mongoose, { Document, Schema } from "mongoose";

export interface User {
  userName: string;
  activeRoomId: string;
}

const userSchema = new Schema<User & Document>(
  {
    userName: {
      type: String,
      required: true,
    },
    activeRoomId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.index({ userName: 1, activeRoomId: 1 }, { unique: true });

const UserModel = mongoose.model<User & Document>("User", userSchema);

export default UserModel;
