/**
 * Main entry point for Bengali Multiplication game
 * Initializes the game and sets up event listeners
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the game manager which coordinates everything
    gameManager.init();
    
    // Set up event listeners for game controls
    setupEventListeners();
    
    console.log('Bengali Multiplication Game initialized');
});

/**
 * Setup event listeners for the game
 */
function setupEventListeners() {
    // Start button
    const startButton = document.getElementById('startButton');
    if (startButton) {
        startButton.addEventListener('click', function() {
            gameManager.startGame();
        });
    }
    
    // Replay button on end screen
    const replayButton = document.getElementById('replayButton');
    if (replayButton) {
        replayButton.addEventListener('click', function() {
            gameManager.startGame();
        });
    }
    
    // Sound toggle button
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
        soundToggle.addEventListener('click', function() {
            toggleSound();
        });
    }
    
    // Listen for keyboard input for numbers 1-9
    document.addEventListener('keydown', function(event) {
        const key = parseInt(event.key);
        if (!isNaN(key) && key >= 1 && key <= 9) {
            // Find button with matching text and click it if found
            const buttons = document.querySelectorAll('#answersGrid button');
            buttons.forEach(button => {
                const bengaliNum = bengaliUtils.toBengaliNumber(key);
                if (button.textContent === bengaliNum) {
                    button.click();
                }
            });
        }
    });
}

/**
 * Toggle sound on/off
 */
function toggleSound() {
    const soundToggle = document.getElementById('soundToggle');
    if (!soundToggle) return;
    
    config.tts.enabled = !config.tts.enabled;
    
    if (config.tts.enabled) {
        soundToggle.textContent = '🔊';
        soundToggle.title = 'Sound On';
    } else {
        soundToggle.textContent = '🔇';
        soundToggle.title = 'Sound Off';
    }
    
    // Update TTS service
    ttsService.isEnabled = config.tts.enabled;
}

/**
 * Update UI element for Bengali number pronunciation
 * This function is used to repeat pronunciation when clicked on the question
 */
document.addEventListener('DOMContentLoaded', function() {
    const question = document.getElementById('question');
    if (question) {
        question.addEventListener('click', function() {
            if (gameManager.state.currentQuestionData) {
                ttsService.speakMultiplication(
                    gameManager.state.currentQuestionData.num1, 
                    gameManager.state.currentQuestionData.num2
                );
            }
        });
    }
});
