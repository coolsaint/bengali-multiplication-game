/**
 * UI Manager for Bengali Multiplication game
 * Handles all DOM updates and UI interactions
 */

import config from './config.js';
import bengaliUtils from './bengali-utils.js';

interface Question {
    num1: number;
    num2: number;
    stage: number;
    correctAnswer: number;
}

interface UIElements {
    score: HTMLElement | null;
    questionNumber: HTMLElement | null;
    streak: HTMLElement | null;
    question: HTMLElement | null;
    answersGrid: HTMLElement | null;
    message: HTMLElement | null;
    stageDisplay: HTMLElement | null;
    topEmoji: HTMLElement | null;
    bottomEmoji: HTMLElement | null;
    startScreen: HTMLElement | null;
    gameScreen: HTMLElement | null;
    endScreen: HTMLElement | null;
    finalScore: HTMLElement | null;
    encouragement: HTMLElement | null;
}

interface UIManager {
    elements: UIElements;
    init(): void;
    showStartScreen(): void;
    showGameScreen(): void;
    showEndScreen(score: number, totalPossible: number): void;
    updateScore(score: number): void;
    updateQuestionNumber(current: number, total: number): void;
    updateStreak(streak: number): void;
    updateStageDisplay(stage: number): void;
    displayQuestion(question: Question): void;
    getRandomEmoji(emojis: string[]): string;
}

const uiManager: UIManager = {
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
    init(): void {
        console.log('UI Manager initialized');
    },
    
    /**
     * Show the start screen
     */
    showStartScreen(): void {
        if (!this.elements.startScreen || !this.elements.gameScreen || !this.elements.endScreen) return;
        
        this.elements.startScreen.classList.remove('hidden');
        this.elements.gameScreen.classList.add('hidden');
        this.elements.endScreen.classList.add('hidden');
    },
    
    /**
     * Show the game screen
     */
    showGameScreen(): void {
        if (!this.elements.startScreen || !this.elements.gameScreen || !this.elements.endScreen) return;
        
        this.elements.startScreen.classList.add('hidden');
        this.elements.gameScreen.classList.remove('hidden');
        this.elements.endScreen.classList.add('hidden');
    },
    
    /**
     * Show the end screen
     * @param score - Final score
     * @param totalPossible - Maximum possible score
     */
    showEndScreen(score: number, totalPossible: number): void {
        if (!this.elements.startScreen || !this.elements.gameScreen || 
            !this.elements.endScreen || !this.elements.finalScore || 
            !this.elements.encouragement) return;
        
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
     * @param score - Current score
     */
    updateScore(score: number): void {
        if (!this.elements.score) return;
        this.elements.score.textContent = bengaliUtils.toBengaliNumber(score);
    },
    
    /**
     * Update the question number display
     * @param current - Current question number
     * @param total - Total number of questions
     */
    updateQuestionNumber(current: number, total: number): void {
        if (!this.elements.questionNumber) return;
        this.elements.questionNumber.textContent = `${bengaliUtils.toBengaliNumber(current)}/${bengaliUtils.toBengaliNumber(total)}`;
    },
    
    /**
     * Update the streak display
     * @param streak - Current streak
     */
    updateStreak(streak: number): void {
        if (!this.elements.streak) return;
        this.elements.streak.textContent = bengaliUtils.toBengaliNumber(streak);
    },
    
    /**
     * Update the stage display
     * @param stage - Current stage
     */
    updateStageDisplay(stage: number): void {
        if (!this.elements.stageDisplay) return;
        this.elements.stageDisplay.innerHTML = stage === 1 ? 
            '📚 Stage 1: Numbers 📚' : 
            '🧸 Stage 2: Teddy Bears 🧸';
    },
    
    /**
     * Display a question
     * @param question - Question object with num1, num2, and stage properties
     */
    displayQuestion(question: Question): void {
        if (!this.elements.question || !this.elements.topEmoji || !this.elements.bottomEmoji) return;
        
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
    
    /**
     * Get a random emoji from an array
     * @param emojis - Array of emojis
     * @returns A random emoji
     */
    getRandomEmoji(emojis: string[]): string {
        return emojis[Math.floor(Math.random() * emojis.length)];
    }
};

export default uiManager;
