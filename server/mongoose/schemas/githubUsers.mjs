import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  githubID: {
    type: String,
    required: true,
    unique: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
});

export const GithubUser = mongoose.model('GithubUser', userSchema);
