import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    unique: true,
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  name: String,
});

export const User = mongoose.model('User', userSchema);
