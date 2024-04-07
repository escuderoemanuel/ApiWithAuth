const express = require('express');
const { PORT } = require('./config/environment');

const app = express();

// Pseudo DB
const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@gmail.com',
    password: '1234',
  },
  {
    id: 2,
    name: 'Jane Doe',
    email: 'jane@gmail.com',
    password: '1234',
  },
];

const posts = [
  {
    id: 1,
    title: 'Post 1',
    content: 'Content 1',
  },
  {
    id: 2,
    title: 'Post 2',
    content: 'Content 2',
  },
];

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Function to verify user credentials
const verifyCredentials = (email, password) => {
  const user = users.find(user => user.email === email);
  if (!user) {
    return false; // User not found
  }
  if (user.password !== password) {
    return false; // Invalid password
  }
  return true; // Valid credentials
};

// Middleware to require login
const requireAuthentication = (req, res, next) => {
  const email = req.headers['user'];
  const password = req.headers['password'];
  if (verifyCredentials(email, password)) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized Access." });
  }
};

// Routes for users
app.get('/api/users', (req, res) => {
  res.json(users);
});

app.get('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(user => user.id === userId);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found." });
  }
});

app.post('/api/users', (req, res) => {
  const user = req.body;
  users.push(user);
  res.json(user);
});

app.put('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const index = users.findIndex(user => user.id === userId);
  if (index !== -1) {
    users[index] = req.body;
    res.json(users[index]);
  } else {
    res.status(404).json({ message: "User not found." });
  }
});

app.delete('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const index = users.findIndex(user => user.id === userId);
  if (index !== -1) {
    const deletedUser = users.splice(index, 1);
    res.json(deletedUser[0]);
  } else {
    res.status(404).json({ message: "User not found." });
  }
});

// Routes for posts
app.get('/api/posts', requireAuthentication, (req, res) => {
  res.json(posts);
});

app.get('/api/posts/:id', requireAuthentication, (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find(post => post.id === postId);
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ message: "Post not found." });
  }
});

app.post('/api/posts', requireAuthentication, (req, res) => {
  const post = req.body;
  posts.push(post);
  res.json(post);
});

app.put('/api/posts/:id', requireAuthentication, (req, res) => {
  const postId = parseInt(req.params.id);
  const index = posts.findIndex(post => post.id === postId);
  if (index !== -1) {
    posts[index] = req.body;
    res.json(posts[index]);
  } else {
    res.status(404).json({ message: "Post not found." });
  }
});

app.delete('/api/posts/:id', requireAuthentication, (req, res) => {
  const postId = parseInt(req.params.id);
  const index = posts.findIndex(post => post.id === postId);
  if (index !== -1) {
    const deletedPost = posts.splice(index, 1);
    res.json(deletedPost[0]);
  } else {
    res.status(404).json({ message: "Post not found." });
  }
});

// Start server
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
