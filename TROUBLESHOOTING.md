# Future You AI - Troubleshooting Guide

This guide provides solutions for common issues you might encounter when setting up or using the Future You AI application.

## Table of Contents

- [Server Issues](#server-issues)
- [Authentication Issues](#authentication-issues)
- [OpenAI API Issues](#openai-api-issues)
- [Voice Recognition Issues](#voice-recognition-issues)
- [Voice Output Issues](#voice-output-issues)
- [Browser Compatibility Issues](#browser-compatibility-issues)
- [MongoDB Issues](#mongodb-issues)
- [Performance Issues](#performance-issues)

## Server Issues

### Server won't start

**Issue**: When running `npm start` or `npm run dev`, the server fails to start.

**Possible Solutions**:

1. **Port already in use**:
   ```
   Error: listen EADDRINUSE: address already in use :::3001
   ```
   
   Change the port in your `.env` file:
   ```
   PORT=3002
   ```

2. **Missing dependencies**:
   ```
   Error: Cannot find module 'express'
   ```
   
   Run `npm install` to install all dependencies.

3. **Node.js version**:
   Ensure you're using Node.js version 14 or higher. Check with:
   ```bash
   node --version
   ```

### Server crashes unexpectedly

**Issue**: The server starts but crashes after some time or when performing certain actions.

**Possible Solutions**:

1. **Memory issues**: Check if your server is running out of memory. Consider increasing the memory limit:
   ```bash
   node --max-old-space-size=4096 server.js
   ```

2. **Unhandled promise rejections**: Look for errors in the console related to unhandled promises. Add proper error handling to your async functions.

3. **Check logs**: Run the server with more verbose logging:
   ```bash
   DEBUG=* npm run dev
   ```

## Authentication Issues

### Registration fails

**Issue**: Unable to register a new user.

**Possible Solutions**:

1. **Email already in use**: Try a different email address.

2. **Password requirements**: Ensure the password meets the minimum requirements (at least 8 characters).

3. **Server error**: Check the server logs for more details.

### Login fails

**Issue**: Unable to log in with registered credentials.

**Possible Solutions**:

1. **Incorrect credentials**: Double-check your email and password.

2. **Case sensitivity**: Email addresses are case-sensitive in some systems.

3. **Account not found**: Make sure you've registered with this email address.

### JWT token issues

**Issue**: Authentication fails with JWT-related errors.

**Possible Solutions**:

1. **Missing JWT secret**: Ensure you have set the `JWT_SECRET` in your `.env` file.

2. **Token expired**: The JWT token might have expired. Try logging in again.

3. **Invalid token**: Clear your browser's local storage and log in again.

## OpenAI API Issues

### API key errors

**Issue**: Errors related to the OpenAI API key.

**Possible Solutions**:

1. **Missing API key**: Ensure you have set the `OPENAI_API_KEY` in your `.env` file.

2. **Invalid API key**: Verify that your API key is correct by checking in the OpenAI dashboard.

3. **API key format**: Make sure there are no extra spaces, quotes, or special characters in your API key.

### Quota exceeded

**Issue**: OpenAI API returns "quota exceeded" errors.

**Possible Solutions**:

1. **Check usage**: Review your usage in the OpenAI dashboard.

2. **Billing information**: Ensure your billing information is up to date.

3. **Rate limiting**: Implement rate limiting in your application to prevent excessive API calls.

### Slow responses

**Issue**: OpenAI API responses are taking too long.

**Possible Solutions**:

1. **Network issues**: Check your internet connection.

2. **API load**: The OpenAI API might be experiencing high load. Implement retry logic with exponential backoff.

3. **Request optimization**: Reduce the complexity of your prompts or the number of tokens requested.

## Voice Recognition Issues

### Microphone not working

**Issue**: The voice recognition feature doesn't detect your voice.

**Possible Solutions**:

1. **Browser permissions**: Ensure you've granted microphone permissions to the website.

2. **Browser support**: Check if your browser supports the Web Speech API. Chrome is recommended.

3. **Hardware issues**: Test your microphone with another application to ensure it's working properly.

### Recognition accuracy

**Issue**: Voice recognition is not accurate or misinterprets your speech.

**Possible Solutions**:

1. **Background noise**: Reduce background noise and speak clearly.

2. **Microphone quality**: Use a better quality microphone if available.

3. **Language settings**: Ensure the recognition language matches your speaking language.

## Voice Output Issues

### No sound

**Issue**: The AI responses are not being spoken aloud.

**Possible Solutions**:

1. **Speaker toggle**: Check if the speaker is toggled on (speaker icon should show 🔊 not 🔇).

2. **Browser support**: Ensure your browser supports the Web Speech API. Chrome is recommended.

3. **System volume**: Check your device's volume settings.

### Voice quality

**Issue**: The AI voice sounds robotic or unnatural.

**Possible Solutions**:

1. **Voice selection**: Different browsers use different voice synthesis engines. Try another browser.

2. **Voice settings**: Adjust the rate, pitch, and volume settings in the code.

## Browser Compatibility Issues

### Layout issues

**Issue**: The application layout appears broken or misaligned.

**Possible Solutions**:

1. **Browser version**: Ensure you're using a modern browser version.

2. **Zoom level**: Check your browser's zoom level (should be at 100%).

3. **CSS compatibility**: Some CSS features might not be supported in older browsers. Use a modern browser like Chrome, Firefox, Edge, or Safari.

### JavaScript errors

**Issue**: The application doesn't work due to JavaScript errors.

**Possible Solutions**:

1. **Browser console**: Check the browser console (F12) for specific error messages.

2. **JavaScript version**: Ensure your browser supports modern JavaScript features (ES6+).

3. **Browser extensions**: Disable browser extensions that might interfere with the application.

## MongoDB Issues

### Connection errors

**Issue**: Unable to connect to MongoDB.

**Possible Solutions**:

1. **MongoDB running**: Ensure MongoDB is installed and running on your system.

2. **Connection string**: Verify the MongoDB connection string in your `.env` file.

3. **Network issues**: Check if MongoDB is accessible from your application (especially if using a remote MongoDB instance).

### Data persistence

**Issue**: Data is not being saved to MongoDB.

**Possible Solutions**:

1. **Schema validation**: Ensure your data matches the defined schema.

2. **Error handling**: Check for MongoDB operation errors in your server logs.

3. **Permissions**: Verify that your MongoDB user has write permissions.

## Performance Issues

### Slow loading

**Issue**: The application takes a long time to load.

**Possible Solutions**:

1. **Network speed**: Check your internet connection.

2. **Server resources**: Ensure your server has sufficient resources (CPU, memory).

3. **Optimization**: Consider optimizing your code, reducing bundle size, or implementing lazy loading.

### High CPU/memory usage

**Issue**: The application uses excessive CPU or memory resources.

**Possible Solutions**:

1. **Memory leaks**: Check for memory leaks in your code, especially with event listeners.

2. **Resource-intensive operations**: Optimize or defer resource-intensive operations.

3. **Browser resources**: Close unnecessary browser tabs or applications to free up resources.

---

If you encounter issues not covered in this guide, please open an issue on the GitHub repository or contact the project maintainer.

