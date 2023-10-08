// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const cors = require('cors');

//const Blog = require('/model/Blog');
//const User = require('./Model/Blog');

const app = express();
app.use(cors());

// Middleware configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.session());
app.use(passport.initialize());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/abi', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});
const Blog = mongoose.model('Blog', blogSchema);
// Passport configuration
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Routes for authentication
app.post('/login', passport.authenticate('local'), (req, res) => {
  console.log(req.user); 
  res.json({ message: 'Login successful', user: req.user });
});


app.get('/logout', (req, res) => {
  req.logout();
  res.json({ message: 'Logout successful' });
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: 'Username and password are required' });
    return;
  }
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({ message: 'Username already exists' });
      return;
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ username, password: hashedPassword });
    
    await newUser.save();
    res.json({ message: 'Registration successful', user: newUser });
  } catch (error) {
    console.error('Registration failed:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});
// Route to create a new blog
app.post('/create-blog', async (req, res) => {
  const { title, content } = req.body;
  try {
    const newBlog = new Blog({
      title,
      content,
      author: req.user._id, 
    });
    await newBlog.save();
    res.json({ message: 'Blog created successfully', blog: newBlog });
  } catch (error) {
    console.error('Blog creation failed:', error);
    res.status(500).json({ message: 'Blog creation failed' });
  }
});
// Route to retrieve blogs with pagination
app.get('/blogs', async (req, res) => {
  const page = req.query.page || 1;
  const perPage = 10; 

  try {
    const blogs = await Blog.find()
      .skip((page - 1) * perPerPage)
      .limit(perPage)
      .exec();

    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Error fetching blogs' });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed due to app termination');
    process.exit(0);
  });
});