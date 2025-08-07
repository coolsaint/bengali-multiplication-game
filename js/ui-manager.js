/**
 * UI Manager for Bengali Multiplication game
 * Handles all DOM updates and UI interactions
 */
const uiManager = {
    // DOM element references
    elements: {
        score: document.getElementById('score'),
        questionNumber: document.getElementById('questionNumber'),
        streak: document.getElementById('streak'),
        question: document.getElementById('question'),
        answersGrid: document.getElementById('answersGrid'),
        message: document.getElementById('message'),
        stageDisplay: document.getElementById('stageDisplay'),
        topEmoji: document.getElementById('topEmoji'),
        bottomEmoji: document.getElementById('bottomEmoji'),
        startScreen: document.getElementById('startScreen'),
        gameScreen: document.getElementById('gameScreen'),
        endScreen: document.getElementById('endScreen'),
        finalScore: document.getElementById('finalScore'),
        encouragement: document.getElementById('encouragement')
    },
    
    /**
     * Initialize UI manager
     */
    init: function() {
        console.log('UI Manager initialized');
    },
    
    /**
     * Show the start screen
     */
    showStartScreen: function() {
        this.elements.startScreen.classList.remove('hidden');
        this.elements.gameScreen.classList.add('hidden');
        this.elements.endScreen.classList.add('hidden');
    },
    
    /**
     * Show the game screen
     */
    showGameScreen: function() {
        this.elements.startScreen.classList.add('hidden');
        this.elements.gameScreen.classList.remove('hidden');
        this.elements.endScreen.classList.add('hidden');
    },
    
    /**
     * Show the end screen
     * @param {number} score - Final score
     * @param {number} totalPossible - Maximum possible score
     */
    showEndScreen: function(score, totalPossible) {
        this.elements.startScreen.classList.add('hidden');
        this.elements.gameScreen.classList.add('hidden');
        this.elements.endScreen.classList.remove('hidden');
        
        // Display final score
        this.elements.finalScore.innerHTML = 
            `🏆 Final Score: <span style="color: #ff6b6b">${bengaliUtils.toBengaliNumber(score)}</span> / ${bengaliUtils.toBengaliNumber(totalPossible)} 🏆`;
        
        // Display encouragement based on score percentage
        const percentage = (score / totalPossible) * 100;
        let encouragement = '';
        
        if (percentage === 100) {
            encouragement = "🌟 Perfect Score! তুমি একজন গণিত তারকা! You're a Math Star! 🌟";
        } else if (percentage >= 80) {
            encouragement = "🎯 Excellent! চমৎকার করেছো! Keep up the great work! 🎯";
        } else if (percentage >= 60) {
            encouragement = "💪 Good job! ভালো চেষ্টা! Practice makes perfect! 💪";
        } else {
            encouragement = "🌈 Nice try! আরও অনুশীলন করো! You'll do better next time! 🌈";
        }
        
        this.elements.encouragement.textContent = encouragement;
    },
    
    /**
     * Update the score display
     * @param {number} score - Current score
     */
    updateScore: function(score) {
        this.elements.score.textContent = bengaliUtils.toBengaliNumber(score);
    },
    
    /**
     * Update the question number display
     * @param {number} current - Current question number
     * @param {number} total - Total number of questions
     */
    updateQuestionNumber: function(current, total) {
        this.elements.questionNumber.textContent = `${bengaliUtils.toBengaliNumber(current)}/${bengaliUtils.toBengaliNumber(total)}`;
    },
    
    /**
     * Update the streak display
     * @param {number} streak - Current streak
     */
    updateStreak: function(streak) {
        this.elements.streak.textContent = bengaliUtils.toBengaliNumber(streak);
    },
    
    /**
     * Update the stage display
     * @param {number} stage - Current stage
     */
    updateStageDisplay: function(stage) {
        this.elements.stageDisplay.innerHTML = stage === 1 ? 
            '📚 Stage 1: Numbers 📚' : 
            '🧸 Stage 2: Teddy Bears 🧸';
    },
    
    /**
     * Display a question
     * @param {object} question - Question object with num1, num2, and stage properties
     */
    displayQuestion: function(question) {
        // Update emojis
        this.elements.topEmoji.textContent = this.getRandomEmoji(config.happyEmojis);
        this.elements.bottomEmoji.textContent = this.getRandomEmoji(config.happyEmojis);
        
        // Display the question based on the stage
        if (question.stage === 1) {
            // Stage 1: Regular numbers
            this.elements.question.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                    <span style="font-size: 1em;">${bengaliUtils.toBengaliNumber(question.num1)} × ${bengaliUtils.toBengaliNumber(question.num2)} = ?</span>
                </div>
            `;
        } else {
            // Stage 2: Visual multiplication with teddy bear emojis
            const teddyBears = bengaliUtils.getTeddyBears(question.num2);
            this.elements.question.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 10px;">
                    <span style="font-size: 1em;">${bengaliUtils.toBengaliNumber(question.num1)} ×</span>
                    <div style="font-size: 1.2em; letter-spacing: 5px; line-height: 2; max-width: 400px; text-align: center;">
                        ${teddyBears}
                    </div>
                    <span style="font-size: 1em;">= ?</span>
                </div>
            `;
        }
    },
}
