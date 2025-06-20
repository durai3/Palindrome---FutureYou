# Future You AI - Setup Guide for VSCode

This guide provides step-by-step instructions for setting up and running the Future You AI project using Visual Studio Code (VSCode).

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setting Up the Project](#setting-up-the-project)
- [Running the Application](#running-the-application)
- [Debugging](#debugging)
- [Common Issues](#common-issues)
- [Additional Resources](#additional-resources)

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js and npm**: Download and install from [nodejs.org](https://nodejs.org/) (version 14 or higher)
2. **Visual Studio Code**: Download and install from [code.visualstudio.com](https://code.visualstudio.com/)
3. **Git**: Download and install from [git-scm.com](https://git-scm.com/)
4. **OpenAI API Key**: Sign up at [platform.openai.com](https://platform.openai.com/) to get your API key

## Setting Up the Project

### Step 1: Clone the Repository

1. Open VSCode
2. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac) to open the command palette
3. Type "Git: Clone" and select it
4. Enter the repository URL or choose to clone from GitHub
5. Select a folder to clone the repository into
6. Click "Open" when prompted to open the cloned repository

Alternatively, you can use the terminal:

```bash
git clone https://github.com/yourusername/future-you-ai.git
cd future-you-ai
code .  # This opens the project in VSCode
```

### Step 2: Install Dependencies

1. In VSCode, open the integrated terminal by pressing `` Ctrl+` `` (Windows/Linux) or `` Cmd+` `` (Mac)
2. Run the following command to install the required dependencies:

```bash
npm install
```

### Step 3: Configure Environment Variables

1. In the project explorer, locate the `.env.example` file
2. Right-click and select "Copy"
3. Right-click in the explorer and select "Paste" to create a new file
4. Rename the new file to `.env`
5. Open the `.env` file and replace the placeholder values with your actual values:

```
OPENAI_API_KEY=your_openai_api_key_here
JWT_SECRET=your_jwt_secret_key_here
PORT=3001
```

## Running the Application

### Development Mode

To run the application in development mode with automatic reloading:

1. Open the integrated terminal in VSCode
2. Run the following command:

```bash
npm run dev
```

3. The server will start, and you should see a message like:
   ```
   🚀 Server running on http://localhost:3001
   💡 Make sure to add your OpenAI API key to the .env file!
   ```

4. Open your browser and navigate to `http://localhost:3001`

### Production Mode

To run the application in production mode:

1. Open the integrated terminal in VSCode
2. Run the following command:

```bash
npm start
```

## Debugging

VSCode provides excellent debugging capabilities for Node.js applications. Here's how to set it up:

1. Click on the "Run and Debug" icon in the activity bar (or press `Ctrl+Shift+D`)
2. Click on "create a launch.json file" and select "Node.js"
3. VSCode will create a `.vscode/launch.json` file with default configurations
4. Replace the content with the following:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/server.js",
      "envFile": "${workspaceFolder}/.env"
    },
    {
      "type": "node",
      "request": "attach",
      "name": "Attach to Process",
      "port": 9229
    }
  ]
}
```

5. Now you can set breakpoints in your code and start debugging by pressing F5

## Common Issues

### Issue: "Error: Cannot find module 'xyz'"

**Solution**: Make sure you've installed all dependencies by running `npm install`. If the issue persists, try deleting the `node_modules` folder and running `npm install` again.

### Issue: "Error: OpenAI API key not configured"

**Solution**: Check that your `.env` file contains the correct OpenAI API key. Make sure there are no spaces or quotes around the key.

### Issue: "Error: listen EADDRINUSE: address already in use :::3001"

**Solution**: Port 3001 is already in use by another application. Either close that application or change the port in the `.env` file.

### Issue: Voice recognition not working

**Solution**: Make sure you're using a compatible browser (Chrome is recommended) and that you've granted microphone permissions when prompted.

## Additional Resources

- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [VSCode Documentation](https://code.visualstudio.com/docs)
- [Web Speech API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

---

If you encounter any issues not covered in this guide, please open an issue on the GitHub repository or contact the project maintainer.

