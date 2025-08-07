/**
 * Question Generator for Bengali Multiplication game
 * Handles question generation and answer validation
 */
const questionGenerator = {
    /**
     * Generate a multiplication question
     * @param {number} stage - Current stage (1 or 2)
     * @returns {Object} Question object with num1, num2, correctAnswer, and stage properties
     */
    generateQuestion: function(stage) {
        // Test multiplication tables from 1 to 10
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        
        return {
            num1: num1,
            num2: num2,
            correctAnswer: num1 * num2,
            stage: stage
        };
    },
    
    /**
     * Generate answer options for a question
     * @param {number} correctAnswer - The correct answer
     * @returns {Array} Array of answer options including the correct answer
     */
    generateAnswerOptions: function(correctAnswer) {
        const answers = [correctAnswer];
        
        // Generate 3 wrong answers
        while (answers.length < 4) {
            let wrongAnswer = correctAnswer + (Math.random() < 0.5 ? -1 : 1) * (Math.floor(Math.random() * 10) + 1);
            if (wrongAnswer > 0 && !answers.includes(wrongAnswer)) {
                answers.push(wrongAnswer);
            }
        }
        
        // Shuffle answers
        return this.shuffleArray(answers);
    },
    
    /**
     * Shuffle an array using Fisher-Yates algorithm
     * @param {Array} array - Array to shuffle
     * @returns {Array} Shuffled array
     */
    shuffleArray: function(array) {
        const newArray = [...array]; // Create a copy
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Swap
        }
        return newArray;
    },
    
    /**
     * Check if an answer is correct
     * @param {number} userAnswer - The user's answer
     * @param {number} correctAnswer - The correct answer
     * @returns {boolean} True if answer is correct
     */
    checkAnswer: function(userAnswer, correctAnswer) {
        return userAnswer === correctAnswer;
    }
};
