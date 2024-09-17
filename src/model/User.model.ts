import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: [true, "Please enter the message"],
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpire: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
}

const userSchema: Schema<User> = new Schema({
  username: {
    type: String,
    index: true,
    unique: true,
    trim: true,
    required: [true, "username is required"],
  },
  email: {
    type: String,
    required: [true, "Enter email address"],
    trim: true,
    unique: true,
    match: [
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
      "Please enter a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "password must be 6 character long"],
  },
  verifyCode: {
    type: String,
    required: [true, "verify code is required"],
  },
  verifyCodeExpire: {
    type: Date,
    required: [true, "verify code expire is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);

export default UserModel;
