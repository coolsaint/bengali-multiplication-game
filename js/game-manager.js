/**
 * Game Manager for Bengali Multiplication game
 * Coordinates game flow and integrates other modules
 */
const gameManager = {
    // Game state
    state: {
        score: 0,
        currentQuestion: 1,
        totalQuestions: config.totalQuestions,
        streak: 0,
        currentStage: 1,
        currentQuestionData: null,
    },
    
    /**
     * Initialize the game
     */
    init: function() {
        // Initialize other modules
        ttsService.init();
        uiManager.init();
        
        // Show the start screen
        uiManager.showStartScreen();
        
        console.log('Game Manager initialized');
    },
    
    /**
     * Start a new game
     */
    startGame: function() {
        // Reset game state
        this.state.score = 0;
        this.state.currentQuestion = 1;
        this.state.streak = 0;
        this.state.currentStage = 1;
        
        // Update UI
        uiManager.updateScore(this.state.score);
        uiManager.updateQuestionNumber(this.state.currentQuestion, this.state.totalQuestions);
        uiManager.updateStreak(this.state.streak);
        uiManager.updateStageDisplay(this.state.currentStage);
        uiManager.showGameScreen();
        
        // Generate first question
        this.generateQuestion();
    },
    
    /**
     * Generate a new question
     */
    generateQuestion: function() {
        // Determine stage based on question number
        this.state.currentStage = this.state.currentQuestion <= config.questionsPerStage ? 1 : 2;
        
        // Update stage display
        uiManager.updateStageDisplay(this.state.currentStage);
        
        // Generate question
        this.state.currentQuestionData = questionGenerator.generateQuestion(this.state.currentStage);
        
        // Display question
        uiManager.displayQuestion(this.state.currentQuestionData);
        
        // Generate and display answer options
        const answerOptions = questionGenerator.generateAnswerOptions(this.state.currentQuestionData.correctAnswer);
        this.displayAnswerOptions(answerOptions);
        
        // Speak the question using Google TTS
        ttsService.speakMultiplication(
            this.state.currentQuestionData.num1, 
            this.state.currentQuestionData.num2
        );
    },
    
    /**
     * Display answer options
     * @param {Array} answerOptions - Array of answer options
     */
    displayAnswerOptions: function(answerOptions) {
        const answersGrid = document.getElementById('answersGrid');
        answersGrid.innerHTML = '';
        
        answerOptions.forEach(answer => {
            const button = document.createElement('button');
            button.className = 'answer-btn';
            button.textContent = bengaliUtils.toBengaliNumber(answer);
            button.onclick = () => this.checkAnswer(answer);
            answersGrid.appendChild(button);
        });
    },
    
    /**
     * Check the user's answer
     * @param {number} userAnswer - The user's answer
     */
    checkAnswer: function(userAnswer) {
        const messageDiv = document.getElementById('message');
        const correctAnswer = this.state.currentQuestionData.correctAnswer;
        
        if (questionGenerator.checkAnswer(userAnswer, correctAnswer)) {
            // Correct answer
            this.handleCorrectAnswer();
        } else {
            // Incorrect answer
            this.handleIncorrectAnswer();
            
            // Speak the correct number
            setTimeout(() => {
                ttsService.speakNumber(correctAnswer);
            }, 1000);
        }
    },
    
    /**
     * Handle correct answer
     */
    handleCorrectAnswer: function() {
        // Update score and streak
        this.state.score += 10;
        this.state.streak++;
        
        // Update UI
        uiManager.updateScore(this.state.score);
        uiManager.updateStreak(this.state.streak);
        
        // Show success message
        const messageDiv = document.getElementById('message');
        messageDiv.className = 'message correct';
        const randomMessage = this.getRandomItem(config.celebrationMessages);
        messageDiv.innerHTML = `${this.getRandomItem(config.happyEmojis)} ${randomMessage} ${this.getRandomItem(config.happyEmojis)}`;
        
        // Proceed to next question after delay
        setTimeout(() => {
            if (this.state.currentQuestion < this.state.totalQuestions) {
                // Check if moving to Stage 2
                if (this.state.currentQuestion === config.questionsPerStage) {
                    this.showStageTransition();
                } else {
                    this.moveToNextQuestion();
                }
            } else {
                this.endGame();
            }
        }, 2000);
    },
    
    /**
     * Handle incorrect answer
     */
    handleIncorrectAnswer: function() {
        // Reset streak
        this.state.streak = 0;
        
        // Update UI
        uiManager.updateStreak(this.state.streak);
        
        // Show error message
        const messageDiv = document.getElementById('message');
        messageDiv.className = 'message incorrect';
        const randomMessage = this.getRandomItem(config.tryAgainMessages);
        messageDiv.innerHTML = `${this.getRandomItem(config.encourageEmojis)} ${randomMessage} ${this.getRandomItem(config.encourageEmojis)}`;
        
        // Clear message after delay
        setTimeout(() => {
            messageDiv.innerHTML = '';
            messageDiv.className = 'message';
        }, 2000);
    },
    
    /**
     * Show stage transition message
     */
    showStageTransition: function() {
        const messageDiv = document.getElementById('message');
        messageDiv.className = 'message correct';
        messageDiv.innerHTML = '🎊 Stage 1 Complete! 🎊<br>🧸 Starting Stage 2 with Teddy Bears! 🧸';
        
        setTimeout(() => {
            this.moveToNextQuestion();
            messageDiv.innerHTML = '';
            messageDiv.className = 'message';
        }, 2500);
    },
    
    /**
     * Move to the next question
     */
    moveToNextQuestion: function() {
        this.state.currentQuestion++;
        uiManager.updateQuestionNumber(this.state.currentQuestion, this.state.totalQuestions);
        this.generateQuestion();
    },
    
    /**
     * End the game
     */
    endGame: function() {
        // Show the end screen
        uiManager.showEndScreen(this.state.score, this.state.totalQuestions * 10);
    },
    
    /**
     * Get a random item from an array
     * @param {Array} array - The array to get a random item from
     * @returns {*} A random item from the array
     */
    getRandomItem: function(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
};
