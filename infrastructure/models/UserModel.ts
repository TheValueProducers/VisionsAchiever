import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  notification: {
    type: Boolean,
    required: true,
    default: false,
  },
  token: {
    type: String,
    default: null,
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  googleId: {
    type: String,
    required: false,
  },
  provider: {
    type: String,
    required: false,
  },
  theme: {
    type: String,
    enum: ["dark", "white"],
    required: true,
    default: "dark",
  },
  language: {
    type: String,
    enum: ["english", "vietnamese", "spanish", "chinese"],
    required: true,
    default: "english",
  },
});

const UserModel = mongoose.models.User || mongoose.model('User', userSchema);

export default UserModel;
