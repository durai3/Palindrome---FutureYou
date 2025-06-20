# Future You AI - Voice AI Motivator

![Future You AI](https://img.shields.io/badge/Future%20You-AI-FF6F61)
![Version](https://img.shields.io/badge/version-1.0.0-DAA520)
![License](https://img.shields.io/badge/license-ISC-blue)

Future You AI is an interactive web application that allows users to chat with an AI representation of their future self. The AI provides personalized advice, motivation, and guidance based on the user's goals, challenges, and aspirations.

## 📋 Table of Contents

- [Features](#-features)
- [Screenshots](#-screenshots)
- [Technologies Used](#-technologies-used)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [MongoDB Integration](#-mongodb-integration)
- [Customization](#-customization)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- **User Authentication**: Secure login and registration system
- **Personalized Onboarding**: Questionnaire to understand user goals and challenges
- **AI Chat Interface**: Text-based conversation with your future self
- **Voice Interaction**: Speak to your future self and hear responses
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with a dark theme
- **Data Persistence**: Save chat history and user preferences
- **Keyboard Shortcuts**: Efficient navigation and control
- **Accessibility**: Screen reader support and keyboard navigation

## 📸 Screenshots

_Add screenshots of your application here_

## 🛠️ Technologies Used

- **Frontend**:

  - HTML5
  - CSS3
  - JavaScript (ES6+)
  - Web Speech API for voice recognition and synthesis

- **Backend**:

  - Node.js
  - Express.js
  - JSON Web Tokens (JWT) for authentication
  - bcrypt.js for password hashing

- **AI Integration**:

  - OpenAI API (GPT-3.5 Turbo)

- **Database** (Optional):
  - MongoDB (with Mongoose)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [OpenAI API Key](https://platform.openai.com/)
- [MongoDB](https://www.mongodb.com/) (optional, for persistent storage)

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/future-you-ai.git
cd future-you-ai
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file and add your OpenAI API key:

```
OPENAI_API_KEY=your_openai_api_key_here
JWT_SECRET=your_jwt_secret_key_here
PORT=3001
```

## 🏃‍♂️ Running the Application

### Development Mode

To run the application in development mode with automatic reloading:

```bash
npm run dev
```

### Production Mode

To run the application in production mode:

```bash
npm start
```

The application will be available at `http://localhost:3001`.

## 📁 Project Structure

```
future-you-ai/
├── public/               # Static files
│   ├── css/              # CSS stylesheets
│   │   ├── styles.css    # Main styles
│   │   ├── onboarding.css # Onboarding-specific styles
│   │   └── chat.css      # Chat interface styles
│   ├── js/               # JavaScript files
│   │   ├── onboarding.js # Onboarding functionality
│   │   └── chat.js       # Chat functionality
│   └── index.html        # Main HTML file
├── auth.js               # Authentication module
├── server.js             # Express server and API endpoints
├── package.json          # Project dependencies
├── .env                  # Environment variables
├── .env.example          # Example environment variables
└── README.md             # Project documentation
```

## 🔌 API Endpoints

### Authentication

- **POST /api/auth/register** - Register a new user

  - Request body: `{ name, email, password }`
  - Response: `{ token, user: { id, name, email } }`

- **POST /api/auth/login** - Login a user

  - Request body: `{ email, password }`
  - Response: `{ token, user: { id, name, email } }`

- **GET /api/auth/user** - Get current user (requires authentication)
  - Headers: `x-auth-token: <jwt_token>`
  - Response: `{ id, name, email, userProfile }`

### User Profile

- **POST /api/user/profile** - Update user profile (requires authentication)
  - Headers: `x-auth-token: <jwt_token>`
  - Request body: `{ userProfile: { ... } }`
  - Response: `{ success: true, userProfile: { ... } }`

### Chat

- **POST /api/chat** - Send a message to the AI
  - Request body: `{ message, userProfile }`
  - Response: `{ response }`

### Health Check

- **GET /api/health** - Check if the server is running
  - Response: `{ status: 'Server is running!' }`

## 🗄️ MongoDB Integration

To enable persistent storage with MongoDB:

1. Uncomment the MongoDB connection code in `server.js`
2. Update the MongoDB URI in your `.env` file:

```
MONGODB_URI=mongodb://localhost:27017/future-you-ai
```

3. Restart the server

## 🎨 Customization

### Color Scheme

The application uses the following color palette:

- Background: #1C1C1C (soft black)
- Primary Text: #F5E8D8 (warm beige)
- Accent 1: #FF6F61 (muted coral)
- Accent 2: #DAA520 (golden yellow)
- Hover Effects: #FF4500 (burnt orange)

You can modify these colors in the CSS files to match your brand.

### AI Personality

You can customize the AI personality by modifying the `createSystemPrompt` function in `server.js`.

## ❓ Troubleshooting

### Common Issues

- **Server won't start**: Make sure the port 3001 is not in use by another application
- **OpenAI API errors**: Verify your API key is correct and has sufficient quota
- **Voice recognition not working**: Make sure your browser supports the Web Speech API and you've granted microphone permissions
- **MongoDB connection errors**: Check that MongoDB is running and the connection string is correct

### Browser Compatibility

The application works best in modern browsers:

- Chrome (recommended)
- Firefox
- Edge
- Safari

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

---

Created with ❤️ by Your Name
