/**
 * Onboarding Flow Functionality
 * Handles the multi-step onboarding process for Future You AI
 */

// Global variables
let currentStep = 1;
let totalSteps = 6;
let userProfile = {};
let formErrors = {};

// DOM Elements
const onboardingContainer = document.getElementById('onboardingContainer');
const stepIndicators = document.querySelectorAll('.step-indicator');
const steps = document.querySelectorAll('.step');

/**
 * Initialize the onboarding flow
 */
function initOnboarding() {
    // Set up event listeners for form fields
    setupFormValidation();
    
    // Initialize progress indicators
    updateStepIndicators();
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Set up auto-save functionality
    setupAutoSave();
    
    // Check for saved progress
    checkForSavedProgress();
}

/**
 * Set up form validation for all steps
 */
function setupFormValidation() {
    // Step 1: Basic Info
    document.getElementById('name').addEventListener('blur', validateName);
    document.getElementById('age').addEventListener('blur', validateAge);
    
    // Step 2: Current Situation
    document.getElementById('currentSituation').addEventListener('blur', validateCurrentSituation);
    
    // Step 3: Past Struggles
    document.getElementById('pastStruggles').addEventListener('blur', validatePastStruggles);
    
    // Step 4: Current Challenges
    document.getElementById('currentChallenges').addEventListener('blur', validateCurrentChallenges);
    
    // Step 5: Future Goals
    document.getElementById('futureGoals').addEventListener('blur', validateFutureGoals);
    
    // Step 6: Desired Personality
    document.getElementById('desiredPersonality').addEventListener('blur', validateDesiredPersonality);
    document.getElementById('dreams').addEventListener('blur', validateDreams);
}

/**
 * Set up auto-save functionality
 */
function setupAutoSave() {
    // Auto-save on input changes
    const formInputs = document.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('change', () => {
            saveProgress();
        });
    });
    
    // Auto-save every 30 seconds
    setInterval(saveProgress, 30000);
}

/**
 * Save current progress to localStorage
 */
function saveProgress() {
    // Save current step data
    saveStepData(currentStep);
    
    // Save to localStorage
    localStorage.setItem('futureYouProgress', JSON.stringify({
        currentStep: currentStep,
        userProfile: userProfile
    }));
    
    // Show save indicator
    showSaveIndicator();
}

/**
 * Show a temporary save indicator
 */
function showSaveIndicator() {
    // Create or get save indicator
    let saveIndicator = document.getElementById('saveIndicator');
    if (!saveIndicator) {
        saveIndicator = document.createElement('div');
        saveIndicator.id = 'saveIndicator';
        saveIndicator.className = 'save-indicator';
        saveIndicator.innerHTML = '<i class="fas fa-check-circle"></i> Progress saved';
        document.body.appendChild(saveIndicator);
    }
    
    // Show and fade out
    saveIndicator.classList.add('active');
    setTimeout(() => {
        saveIndicator.classList.remove('active');
    }, 2000);
}

/**
 * Check for saved progress in localStorage
 */
function checkForSavedProgress() {
    const savedProgress = localStorage.getItem('futureYouProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        
        // Restore user profile
        userProfile = progress.userProfile || {};
        
        // Restore form values
        restoreFormValues();
        
        // Ask if user wants to continue from saved progress
        if (progress.currentStep > 1) {
            showContinuePrompt(progress.currentStep);
        }
    }
}

/**
 * Restore form values from saved userProfile
 */
function restoreFormValues() {
    // Step 1: Basic Info
    if (userProfile.name) document.getElementById('name').value = userProfile.name;
    if (userProfile.age) document.getElementById('age').value = userProfile.age;
    
    // Step 2: Current Situation
    if (userProfile.currentSituation) document.getElementById('currentSituation').value = userProfile.currentSituation;
    
    // Step 3: Past Struggles
    if (userProfile.pastStruggles) document.getElementById('pastStruggles').value = userProfile.pastStruggles;
    
    // Step 4: Current Challenges
    if (userProfile.currentChallenges) document.getElementById('currentChallenges').value = userProfile.currentChallenges;
    
    // Step 5: Future Goals
    if (userProfile.futureGoals) document.getElementById('futureGoals').value = userProfile.futureGoals;
    
    // Step 6: Desired Personality
    if (userProfile.desiredPersonality) document.getElementById('desiredPersonality').value = userProfile.desiredPersonality;
    if (userProfile.dreams) document.getElementById('dreams').value = userProfile.dreams;
}

/**
 * Show prompt to continue from saved progress
 */
function showContinuePrompt(savedStep) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Continue Your Journey?</h3>
            <p>We found your saved progress. Would you like to continue where you left off?</p>
            <div class="button-group">
                <button class="secondary-button" onclick="startFresh()">Start Fresh</button>
                <button onclick="continueProgress(${savedStep})">Continue</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 100);
}

/**
 * Start fresh and clear saved progress
 */
function startFresh() {
    // Clear localStorage
    localStorage.removeItem('futureYouProgress');
    
    // Reset form
    userProfile = {};
    currentStep = 1;
    
    // Clear form values
    const formInputs = document.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.value = '';
    });
    
    // Update UI
    updateStepIndicators();
    showCurrentStep();
    
    // Close modal
    closeModal();
}

/**
 * Continue from saved progress
 */
function continueProgress(savedStep) {
    // Set current step
    currentStep = savedStep;
    
    // Update UI
    updateStepIndicators();
    showCurrentStep();
    
    // Close modal
    closeModal();
}

/**
 * Close the modal
 */
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

/**
 * Handle keyboard navigation
 */
function handleKeyboardNavigation(e) {
    // Only handle if onboarding is visible
    if (onboardingContainer.classList.contains('hidden')) return;
    
    // Enter key to advance
    if (e.key === 'Enter' && !e.shiftKey) {
        if (currentStep < totalSteps) {
            e.preventDefault();
            nextStep();
        } else if (currentStep === totalSteps) {
            e.preventDefault();
            startChat();
        }
    }
    
    // Escape key to go back
    if (e.key === 'Escape' && currentStep > 1) {
        e.preventDefault();
        prevStep();
    }
}

/**
 * Move to the next step in the onboarding flow
 */
function nextStep() {
    // Validate current step
    if (!validateStep(currentStep)) {
        shakeCurrentStep();
        return;
    }

    // Save current step data
    saveStepData(currentStep);

    // Move to next step
    document.getElementById(`step${currentStep}`).classList.remove('active');
    currentStep++;
    document.getElementById(`step${currentStep}`).classList.add('active');
    updateStepIndicators();
    
    // Scroll to top of step
    onboardingContainer.scrollTop = 0;
    
    // Save progress
    saveProgress();
}

/**
 * Move to the previous step in the onboarding flow
 */
function prevStep() {
    // Save current step data
    saveStepData(currentStep);
    
    // Move to previous step
    document.getElementById(`step${currentStep}`).classList.remove('active');
    currentStep--;
    document.getElementById(`step${currentStep}`).classList.add('active');
    updateStepIndicators();
    
    // Scroll to top of step
    onboardingContainer.scrollTop = 0;
    
    // Save progress
    saveProgress();
}

/**
 * Update the step indicators based on current step
 */
function updateStepIndicators() {
    stepIndicators.forEach(indicator => {
        const step = parseInt(indicator.getAttribute('data-step'));
        indicator.classList.remove('active', 'completed');
        
        if (step === currentStep) {
            indicator.classList.add('active');
        } else if (step < currentStep) {
            indicator.classList.add('completed');
        }
    });
}

/**
 * Show the current step
 */
function showCurrentStep() {
    steps.forEach((step, index) => {
        step.classList.remove('active');
        if (index + 1 === currentStep) {
            step.classList.add('active');
        }
    });
}

/**
 * Shake the current step to indicate validation error
 */
function shakeCurrentStep() {
    const currentStepElement = document.getElementById(`step${currentStep}`);
    currentStepElement.classList.add('shake');
    setTimeout(() => {
        currentStepElement.classList.remove('shake');
    }, 500);
}

/**
 * Validate the current step
 */
function validateStep(step) {
    // Reset error messages
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('visible'));
    formErrors = {};
    
    switch(step) {
        case 1:
            validateName();
            validateAge();
            break;
        case 2:
            validateCurrentSituation();
            break;
        case 3:
            validatePastStruggles();
            break;
        case 4:
            validateCurrentChallenges();
            break;
        case 5:
            validateFutureGoals();
            break;
        case 6:
            validateDesiredPersonality();
            validateDreams();
            break;
    }
    
    // Check if there are any errors
    return Object.keys(formErrors).length === 0;
}

/**
 * Validate name field
 */
function validateName() {
    const name = document.getElementById('name').value.trim();
    const errorElement = document.getElementById('nameError');
    
    if (!name) {
        errorElement.classList.add('visible');
        formErrors.name = true;
        return false;
    }
    
    errorElement.classList.remove('visible');
    delete formErrors.name;
    return true;
}

/**
 * Validate age field
 */
function validateAge() {
    const age = document.getElementById('age').value;
    const errorElement = document.getElementById('ageError');
    
    if (!age || age < 13) {
        errorElement.classList.add('visible');
        formErrors.age = true;
        return false;
    }
    
    errorElement.classList.remove('visible');
    delete formErrors.age;
    return true;
}

/**
 * Validate current situation field
 */
function validateCurrentSituation() {
    const currentSituation = document.getElementById('currentSituation').value.trim();
    const errorElement = document.getElementById('currentSituationError');
    
    if (!currentSituation) {
        errorElement.classList.add('visible');
        formErrors.currentSituation = true;
        return false;
    }
    
    errorElement.classList.remove('visible');
    delete formErrors.currentSituation;
    return true;
}

/**
 * Validate past struggles field
 */
function validatePastStruggles() {
    const pastStruggles = document.getElementById('pastStruggles').value.trim();
    const errorElement = document.getElementById('pastStrugglesError');
    
    if (!pastStruggles) {
        errorElement.classList.add('visible');
        formErrors.pastStruggles = true;
        return false;
    }
    
    errorElement.classList.remove('visible');
    delete formErrors.pastStruggles;
    return true;
}

/**
 * Validate current challenges field
 */
function validateCurrentChallenges() {
    const currentChallenges = document.getElementById('currentChallenges').value.trim();
    const errorElement = document.getElementById('currentChallengesError');
    
    if (!currentChallenges) {
        errorElement.classList.add('visible');
        formErrors.currentChallenges = true;
        return false;
    }
    
    errorElement.classList.remove('visible');
    delete formErrors.currentChallenges;
    return true;
}

/**
 * Validate future goals field
 */
function validateFutureGoals() {
    const futureGoals = document.getElementById('futureGoals').value.trim();
    const errorElement = document.getElementById('futureGoalsError');
    
    if (!futureGoals) {
        errorElement.classList.add('visible');
        formErrors.futureGoals = true;
        return false;
    }
    
    errorElement.classList.remove('visible');
    delete formErrors.futureGoals;
    return true;
}

/**
 * Validate desired personality field
 */
function validateDesiredPersonality() {
    const desiredPersonality = document.getElementById('desiredPersonality').value.trim();
    const errorElement = document.getElementById('desiredPersonalityError');
    
    if (!desiredPersonality) {
        errorElement.classList.add('visible');
        formErrors.desiredPersonality = true;
        return false;
    }
    
    errorElement.classList.remove('visible');
    delete formErrors.desiredPersonality;
    return true;
}

/**
 * Validate dreams field
 */
function validateDreams() {
    const dreams = document.getElementById('dreams').value.trim();
    const errorElement = document.getElementById('dreamsError');
    
    if (!dreams) {
        errorElement.classList.add('visible');
        formErrors.dreams = true;
        return false;
    }
    
    errorElement.classList.remove('visible');
    delete formErrors.dreams;
    return true;
}

/**
 * Save data from the current step
 */
function saveStepData(step) {
    switch(step) {
        case 1:
            userProfile.name = document.getElementById('name').value.trim();
            userProfile.age = document.getElementById('age').value;
            break;
        case 2:
            userProfile.currentSituation = document.getElementById('currentSituation').value.trim();
            break;
        case 3:
            userProfile.pastStruggles = document.getElementById('pastStruggles').value.trim();
            break;
        case 4:
            userProfile.currentChallenges = document.getElementById('currentChallenges').value.trim();
            break;
        case 5:
            userProfile.futureGoals = document.getElementById('futureGoals').value.trim();
            break;
        case 6:
            userProfile.desiredPersonality = document.getElementById('desiredPersonality').value.trim();
            userProfile.dreams = document.getElementById('dreams').value.trim();
            break;
    }
}

/**
 * Skip the onboarding process
 */
function skipOnboarding() {
    // For demo purposes, we'll just go straight to the chat with default values
    userProfile = {
        name: document.getElementById('name').value.trim() || "User",
        age: document.getElementById('age').value || "30",
        currentSituation: "Working professional",
        pastStruggles: "Various challenges",
        currentChallenges: "Work-life balance",
        futureGoals: "Career advancement and personal growth",
        desiredPersonality: "Confident and balanced",
        dreams: "Success and happiness"
    };
    
    // Save to localStorage
    localStorage.setItem('futureYouProfile', JSON.stringify(userProfile));
    
    // Start chat
    document.getElementById('onboardingContainer').classList.add('hidden');
    document.getElementById('chatContainer').classList.remove('hidden');
    
    const futureAge = parseInt(userProfile.age) + 7;
    document.getElementById('futureAge').textContent = `Future ${userProfile.name} (Age ${futureAge})`;
    
    // Show typing indicator
    document.getElementById('typingIndicator').classList.add('active');
    
    // Simulate AI thinking and typing
    setTimeout(() => {
        document.getElementById('typingIndicator').classList.remove('active');
        
        // Send welcome message from future self
        addMessage(`Hey ${userProfile.name}! It's so good to finally talk to you. I'm you from 7 years in the future, and I have so much I want to share with you. I remember exactly where you are right now, and I'm here to help guide you through what's coming next. What's on your mind today?`, 'ai');
        
        // Speak the welcome message
        if (speechEnabled) {
            speakText(`Hey ${userProfile.name}! It's so good to finally talk to you. I'm you from 7 years in the future, and I have so much I want to share with you. I remember exactly where you are right now, and I'm here to help guide you through what's coming next. What's on your mind today?`);
        }
    }, 2000);
}

/**
 * Start the chat after completing onboarding
 */
function startChat() {
    if (!validateStep(6)) return;
    saveStepData(6);

    // Save to localStorage
    localStorage.setItem('futureYouProfile', JSON.stringify(userProfile));
    
    // If user is logged in, save to server
    if (isLoggedIn) {
        saveProfileToServer(userProfile);
    }

    document.getElementById('onboardingContainer').classList.add('hidden');
    document.getElementById('chatContainer').classList.remove('hidden');
    
    const futureAge = parseInt(userProfile.age) + 7;
    document.getElementById('futureAge').textContent = `Future ${userProfile.name} (Age ${futureAge})`;

    // Show typing indicator
    document.getElementById('typingIndicator').classList.add('active');
    
    // Simulate AI thinking and typing
    setTimeout(() => {
        document.getElementById('typingIndicator').classList.remove('active');
        
        // Send welcome message from future self
        addMessage(`Hey ${userProfile.name}! It's so good to finally talk to you. I'm you from 7 years in the future, and I have so much I want to share with you. I remember exactly where you are right now, and I'm here to help guide you through what's coming next. What's on your mind today?`, 'ai');
        
        // Speak the welcome message
        if (speechEnabled) {
            speakText(`Hey ${userProfile.name}! It's so good to finally talk to you. I'm you from 7 years in the future, and I have so much I want to share with you. I remember exactly where you are right now, and I'm here to help guide you through what's coming next. What's on your mind today?`);
        }
    }, 2000);
}

/**
 * Save user profile to server
 */
async function saveProfileToServer(userProfile) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) return;
        
        await fetch('/api/user/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify({ userProfile })
        });
    } catch (error) {
        console.error('Error saving profile:', error);
    }
}

// Initialize onboarding when DOM is loaded
document.addEventListener('DOMContentLoaded', initOnboarding);

