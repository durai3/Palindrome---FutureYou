/**
 * Chat Interface Functionality
 * Handles the chat interaction with the Future Self AI
 */

// Global variables
let isRecording = false;
let recognition = null;
let speechEnabled = true;
let isProcessing = false;
let chatHistory = [];
let typingTimeout = null;

// DOM Elements
const chatContainer = document.getElementById('chatContainer');
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const micBtn = document.getElementById('micBtn');
const speakerBtn = document.getElementById('speakerBtn');
const typingIndicator = document.getElementById('typingIndicator');
const speakingIndicator = document.getElementById('speakingIndicator');

/**
 * Initialize the chat interface
 */
function initChat() {
    // Initialize speech recognition
    initSpeechRecognition();
    
    // Load chat history from localStorage
    loadChatHistory();
    
    // Set up event listeners
    setupChatEventListeners();
    
    // Add keyboard shortcuts
    setupKeyboardShortcuts();
}

/**
 * Initialize speech recognition
 */
function initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = function(event) {
            let finalTranscript = '';
            let interimTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            
            if (finalTranscript) {
                messageInput.value = finalTranscript;
            } else if (interimTranscript) {
                messageInput.value = interimTranscript;
            }
        };

        recognition.onend = function() {
            if (isRecording) {
                micBtn.classList.remove('recording');
                micBtn.innerHTML = '<i class="fas fa-microphone"></i>';
                isRecording = false;
                
                const message = messageInput.value.trim();
                if (message) {
                    sendMessage();
                }
            }
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error', event.error);
            micBtn.classList.remove('recording');
            micBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            isRecording = false;
            
            if (event.error === 'not-allowed') {
                showError('Microphone access denied. Please allow microphone access to use voice input.');
            }
        };
    } else {
        // Hide mic button if speech recognition is not supported
        micBtn.style.display = 'none';
        console.warn('Speech recognition not supported in this browser');
    }
}

/**
 * Set up event listeners for the chat interface
 */
function setupChatEventListeners() {
    // Send message on button click
    document.querySelector('.send-btn').addEventListener('click', sendMessage);
    
    // Send message on Enter key
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Show typing indicator when user is typing
    messageInput.addEventListener('input', function() {
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            // Could be used to send "user is typing" status to server
        }, 500);
    });
}

/**
 * Set up keyboard shortcuts for the chat interface
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Only handle if chat container is visible
        if (chatContainer.classList.contains('hidden')) return;
        
        // Ctrl+M to toggle microphone
        if (e.ctrlKey && e.key === 'm') {
            e.preventDefault();
            toggleRecording();
        }
        
        // Ctrl+S to toggle speaker
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            toggleSpeaker();
        }
    });
}

/**
 * Load chat history from localStorage
 */
function loadChatHistory() {
    const savedHistory = localStorage.getItem('futureYouChatHistory');
    if (savedHistory) {
        try {
            chatHistory = JSON.parse(savedHistory);
            
            // Display up to last 10 messages
            const recentMessages = chatHistory.slice(-10);
            recentMessages.forEach(msg => {
                addMessage(msg.text, msg.sender, msg.timestamp, false);
            });
            
            // Scroll to bottom
            scrollToBottom();
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    }
}

/**
 * Save chat history to localStorage
 */
function saveChatHistory() {
    // Keep only the last 50 messages to avoid localStorage limits
    if (chatHistory.length > 50) {
        chatHistory = chatHistory.slice(-50);
    }
    
    localStorage.setItem('futureYouChatHistory', JSON.stringify(chatHistory));
}

/**
 * Toggle recording state for voice input
 */
function toggleRecording() {
    if (!recognition) {
        showError('Speech recognition not supported in this browser');
        return;
    }

    if (isRecording) {
        recognition.stop();
        micBtn.classList.remove('recording');
        micBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        isRecording = false;
    } else {
        try {
            recognition.start();
            micBtn.classList.add('recording');
            micBtn.innerHTML = '<i class="fas fa-stop"></i>';
            isRecording = true;
            messageInput.value = '';
            messageInput.focus();
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            showError('Could not start speech recognition. Please try again.');
        }
    }
}

/**
 * Toggle speaker state for voice output
 */
function toggleSpeaker() {
    speechEnabled = !speechEnabled;
    speakerBtn.innerHTML = speechEnabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
    speakerBtn.title = speechEnabled ? 'Toggle Voice Output' : 'Voice Output Disabled';
    
    if (!speechEnabled) {
        // Cancel any ongoing speech
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
            speakingIndicator.classList.remove('active');
        }
    }
}

/**
 * Send a message to the AI
 */
async function sendMessage() {
    if (isProcessing) return;

    const message = messageInput.value.trim();
    
    if (!message) return;

    isProcessing = true;
    messageInput.value = '';
    hideError();

    // Get user profile
    const userProfile = JSON.parse(localStorage.getItem('futureYouProfile')) || {};

    // Add user message with timestamp
    const timestamp = new Date().toISOString();
    addMessage(message, 'user', timestamp);
    
    // Add to chat history
    chatHistory.push({
        text: message,
        sender: 'user',
        timestamp: timestamp
    });
    
    // Save chat history
    saveChatHistory();

    // Show typing indicator
    typingIndicator.classList.add('active');

    try {
        // Send to backend
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                userProfile: userProfile
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Something went wrong');
        }

        // Hide typing indicator after a realistic delay
        setTimeout(() => {
            typingIndicator.classList.remove('active');
            
            // Add AI response with timestamp
            const aiTimestamp = new Date().toISOString();
            addMessage(data.response, 'ai', aiTimestamp);
            
            // Add to chat history
            chatHistory.push({
                text: data.response,
                sender: 'ai',
                timestamp: aiTimestamp
            });
            
            // Save chat history
            saveChatHistory();

            // Speak the response
            if (speechEnabled) {
                speakText(data.response);
            }
        }, calculateTypingDelay(data.response));

    } catch (error) {
        console.error('Error:', error);
        typingIndicator.classList.remove('active');
        showError(error.message);
        
        // Add error message
        const errorTimestamp = new Date().toISOString();
        addMessage("I'm having trouble connecting right now, but I'm here for you. Can you try again?", 'ai', errorTimestamp);
        
        // Add to chat history
        chatHistory.push({
            text: "I'm having trouble connecting right now, but I'm here for you. Can you try again?",
            sender: 'ai',
            timestamp: errorTimestamp
        });
        
        // Save chat history
        saveChatHistory();
    } finally {
        isProcessing = false;
    }
}

/**
 * Calculate a realistic typing delay based on message length
 */
function calculateTypingDelay(message) {
    // Average reading speed is about 200-250 words per minute
    // We'll use a base delay plus additional time based on message length
    const baseDelay = 1000; // 1 second base delay
    const wordsPerMinute = 600; // AI types faster than humans
    const words = message.split(' ').length;
    const wordDelay = (words / wordsPerMinute) * 60 * 1000;
    
    // Cap the delay at 3 seconds
    return Math.min(baseDelay + wordDelay, 3000);
}

/**
 * Add a message to the chat interface
 */
function addMessage(text, sender, timestamp = new Date().toISOString(), shouldAnimate = true) {
    const messagesContainer = chatMessages;
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    
    if (shouldAnimate) {
        messageDiv.classList.add('animate-in');
    }
    
    // Add message text
    messageDiv.textContent = text;
    
    // Add timestamp
    const timeDiv = document.createElement('div');
    timeDiv.classList.add('message-time');
    
    // Format timestamp
    const messageDate = new Date(timestamp);
    const formattedTime = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    timeDiv.textContent = formattedTime;
    
    messageDiv.appendChild(timeDiv);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    scrollToBottom();
}

/**
 * Scroll the chat container to the bottom
 */
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Speak text using the Web Speech API
 */
function speakText(text) {
    if ('speechSynthesis' in window && speechEnabled) {
        // Cancel any ongoing speech
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Get available voices
        let voices = speechSynthesis.getVoices();
        
        // If voices aren't loaded yet, wait for them
        if (voices.length === 0) {
            speechSynthesis.addEventListener('voiceschanged', () => {
                voices = speechSynthesis.getVoices();
                setVoice(utterance, voices);
            });
        } else {
            setVoice(utterance, voices);
        }
        
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;

        utterance.onstart = () => {
            speakingIndicator.classList.add('active');
        };

        utterance.onend = () => {
            speakingIndicator.classList.remove('active');
        };

        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            speakingIndicator.classList.remove('active');
        };

        speechSynthesis.speak(utterance);
    }
}

/**
 * Set the voice for speech synthesis
 */
function setVoice(utterance, voices) {
    // Try to find a good voice
    let voice = null;
    
    // First preference: Google UK English Female
    voice = voices.find(v => v.name === 'Google UK English Female');
    
    // Second preference: Any English female voice
    if (!voice) {
        voice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Female'));
    }
    
    // Third preference: Any English voice
    if (!voice) {
        voice = voices.find(v => v.lang.startsWith('en'));
    }
    
    // Fallback to the first available voice
    if (!voice && voices.length > 0) {
        voice = voices[0];
    }
    
    if (voice) {
        utterance.voice = voice;
    }
}

/**
 * Show an error message
 */
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    
    // Hide after 5 seconds
    setTimeout(hideError, 5000);
}

/**
 * Hide the error message
 */
function hideError() {
    document.getElementById('errorMessage').classList.add('hidden');
}

/**
 * Clear the chat history
 */
function clearChatHistory() {
    // Clear the chat history array
    chatHistory = [];
    
    // Clear localStorage
    localStorage.removeItem('futureYouChatHistory');
    
    // Clear the chat messages container
    chatMessages.innerHTML = '';
    
    // Add a system message
    addMessage('Chat history has been cleared.', 'system');
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if chat container exists and is visible
    if (chatContainer && !chatContainer.classList.contains('hidden')) {
        initChat();
    }
});



/**
 * Initialize the chat options menu
 */
function initChatOptions() {
    const chatOptions = document.getElementById('chatOptions');
    const chatOptionsMenu = document.getElementById('chatOptionsMenu');
    
    if (chatOptions && chatOptionsMenu) {
        // Toggle menu on click
        chatOptions.addEventListener('click', function(e) {
            e.stopPropagation();
            chatOptionsMenu.classList.toggle('active');
        });
        
        // Close menu when clicking elsewhere
        document.addEventListener('click', function() {
            chatOptionsMenu.classList.remove('active');
        });
        
        // Prevent menu from closing when clicking inside it
        chatOptionsMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}

// Add to the initialization
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if chat container exists and is visible
    if (chatContainer && !chatContainer.classList.contains('hidden')) {
        initChat();
        initChatOptions();
    }
    
    // Initialize chat options even if chat is not visible yet
    initChatOptions();
});

