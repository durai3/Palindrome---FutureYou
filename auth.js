const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// In-memory user storage for demo purposes
const users = [];

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Register a new user
const registerUser = async (name, email, password) => {
  try {
    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      lastLogin: new Date(),
      userProfile: {}
    };
    
    users.push(newUser);
    
    // Create JWT token
    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '1h' });
    
    return { 
      token, 
      user: { 
        id: newUser.id, 
        name: newUser.name, 
        email: newUser.email 
      } 
    };
  } catch (error) {
    throw error;
  }
};

// Login a user
const loginUser = async (email, password) => {
  try {
    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }
    
    // Update last login
    user.lastLogin = new Date();
    
    // Create JWT token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    
    return { 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email 
      } 
    };
  } catch (error) {
    throw error;
  }
};

// Get user by ID
const getUserById = (id) => {
  const user = users.find(user => user.id === id);
  if (!user) {
    return null;
  }
  
  return { 
    id: user.id, 
    name: user.name, 
    email: user.email,
    userProfile: user.userProfile
  };
};

// Update user profile
const updateUserProfile = (userId, userProfile) => {
  const user = users.find(user => user.id === userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  user.userProfile = userProfile;
  return userProfile;
};

// Middleware to verify token
const authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token');
  
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

// Get all users (for demo purposes)
const getAllUsers = () => {
  return users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin
  }));
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  updateUserProfile,
  authMiddleware,
  getAllUsers
};

