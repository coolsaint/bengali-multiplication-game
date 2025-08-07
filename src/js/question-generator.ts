/**
 * Question Generator for Bengali Multiplication game
 * Handles question generation and answer validation
 */

export interface Question {
    num1: number;
    num2: number;
    correctAnswer: number;
    stage: number;
}

interface QuestionGenerator {
    generateQuestion(stage: number): Question;
    generateAnswerOptions(correctAnswer: number): number[];
    shuffleArray<T>(array: T[]): T[];
    checkAnswer(userAnswer: number, correctAnswer: number): boolean;
}

const questionGenerator: QuestionGenerator = {
    /**
     * Generate a multiplication question
     * @param stage - Current stage (1 or 2)
     * @returns Question object with num1, num2, correctAnswer, and stage properties
     */
    generateQuestion(stage: number): Question {
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
     * @param correctAnswer - The correct answer
     * @returns Array of answer options including the correct answer
     */
    generateAnswerOptions(correctAnswer: number): number[] {
        const answers: number[] = [correctAnswer];
        
        // Generate 3 wrong answers
        while (answers.length < 4) {
            const wrongAnswer = correctAnswer + (Math.random() < 0.5 ? -1 : 1) * (Math.floor(Math.random() * 10) + 1);
            if (wrongAnswer > 0 && !answers.includes(wrongAnswer)) {
                answers.push(wrongAnswer);
            }
        }
        
        // Shuffle answers
        return this.shuffleArray(answers);
    },
    
    /**
     * Shuffle an array using Fisher-Yates algorithm
     * @param array - Array to shuffle
     * @returns Shuffled array
     */
    shuffleArray<T>(array: T[]): T[] {
        const newArray = [...array]; // Create a copy
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Swap
        }
        return newArray;
    },
    
    /**
     * Check if an answer is correct
     * @param userAnswer - The user's answer
     * @param correctAnswer - The correct answer
     * @returns True if answer is correct
     */
    checkAnswer(userAnswer: number, correctAnswer: number): boolean {
        return userAnswer === correctAnswer;
    }
};

export default questionGenerator;
