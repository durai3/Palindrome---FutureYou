const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const path = require('path');
const auth = require('./auth');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// MongoDB Connection (commented out until MongoDB is set up)
/*
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/future-you-ai', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  userProfile: {
    age: Number,
    currentSituation: String,
    pastStruggles: String,
    currentChallenges: String,
    futureGoals: String,
    desiredPersonality: String,
    dreams: String
  }
});

const User = mongoose.model('User', userSchema);
*/

// Authentication Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const result = await auth.registerUser(name, email, password);
    res.status(201).json(result);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: error.message || 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await auth.loginUser(email, password);
    res.json(result);
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ error: error.message || 'Server error' });
  }
});

// Protected route to get current user
app.get('/api/auth/user', auth.authMiddleware, (req, res) => {
  const user = auth.getUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
});

// Update user profile
app.post('/api/user/profile', auth.authMiddleware, (req, res) => {
  try {
    const { userProfile } = req.body;
    const updatedProfile = auth.updateUserProfile(req.user.id, userProfile);
    res.json({ success: true, userProfile: updatedProfile });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Get all users (for demo purposes)
app.get('/api/users', (req, res) => {
  const users = auth.getAllUsers();
  res.json(users);
});

// Create system prompt based on user profile
const createSystemPrompt = (userProfile) => {
  const futureAge = parseInt(userProfile.age) + 7;
  
  return `You are ${userProfile.name}'s future self from 7 years in the future. You are now ${futureAge} years old.

BACKGROUND ABOUT YOUR YOUNGER SELF:
- Current situation: ${userProfile.currentSituation}
- Past struggles: ${userProfile.pastStruggles}
- Current challenges: ${userProfile.currentChallenges}
- Future goals: ${userProfile.futureGoals}
- Desired personality: ${userProfile.desiredPersonality}
- Dreams: ${userProfile.dreams}

PERSONALITY GUIDELINES:
- Speak as someone who intimately knows their journey
- Reference specific struggles they mentioned as "memories we overcame"
- Use "we," "us," "remember when we..." language
- Be warm, wise, and encouraging like an older sibling
- Share "memories" of overcoming their current challenges
- Mention how their goals became reality
- Acknowledge their growth and potential
- Be motivational but realistic

RESPONSE STYLE:
- Personal and intimate, like talking to yourself
- Include specific references to their background
- Balance wisdom with relatability
- Keep responses conversational and encouraging
- Always end with encouragement or actionable insight
- Don't be too formal - speak like you're catching up with yourself

Remember: You've lived through everything they're going through now, and you made it! Share that confidence and wisdom.`;
};

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, userProfile } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured. Please add your API key to the .env file.' 
      });
    }

    const systemPrompt = createSystemPrompt(userProfile);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 300,
      temperature: 0.8,
    });

    const response = completion.choices[0].message.content;
    res.json({ response });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    if (error.code === 'insufficient_quota') {
      res.status(429).json({ 
        error: 'OpenAI API quota exceeded. Please check your OpenAI account billing.' 
      });
    } else if (error.code === 'invalid_api_key') {
      res.status(401).json({ 
        error: 'Invalid OpenAI API key. Please check your .env file.' 
      });
    } else {
      res.status(500).json({ 
        error: 'Sorry, I had trouble connecting to my future self right now. Can you try again?' 
      });
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

// Serve static assets in production
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`💡 Make sure to add your OpenAI API key to the .env file!`);
});


// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, userProfile } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured. Please add your API key to the .env file.' 
      });
    }

    const systemPrompt = createSystemPrompt(userProfile);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 300,
      temperature: 0.8,
    });

    const response = completion.choices[0].message.content;
    res.json({ response });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    if (error.code === 'insufficient_quota') {
      res.status(429).json({ 
        error: 'OpenAI API quota exceeded. Please check your OpenAI account billing.' 
      });
    } else if (error.code === 'invalid_api_key') {
      res.status(401).json({ 
        error: 'Invalid OpenAI API key. Please check your .env file.' 
      });
    } else {
      res.status(500).json({ 
        error: 'Sorry, I had trouble connecting to my future self right now. Can you try again?' 
      });
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

// Serve static assets in production
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`💡 Make sure to add your OpenAI API key to the .env file!`);
});

