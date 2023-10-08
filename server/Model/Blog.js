//
const mongoose = require('mongoose');

// Define User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

//const User = mongoose.model('User', userSchema);

// Define Blog Schema
const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Blog = mongoose.model('Blog', blogSchema);



