/**
 * Configuration types for Bengali Multiplication Magic game
 */
export interface TTSConfig {
    enabled: boolean;
    supabaseUrl: string;
    supabaseEndpoint: string;
    supabaseAnonKey: string;
    language: string;
    voice: string;
    // VPS server configuration
    serverUrl: string;
    endpoint: string;
    fallbackToWebSpeech: boolean;
}

export interface GameConfig {
    totalQuestions: number;
    questionsPerStage: number;
    stages: number;
    tts: TTSConfig;
    happyEmojis: string[];
    encourageEmojis: string[];
    teddyBear: string;
    celebrationMessages: string[];
    tryAgainMessages: string[];
}

/**
 * Configuration settings for Bengali Multiplication Magic game
 */
const config: GameConfig = {
    // Game settings
    totalQuestions: 20, // 10 questions per stage, 2 stages
    questionsPerStage: 10,
    stages: 2,
    
    // Google TTS settings
    tts: {
        enabled: true,
        // Legacy Supabase fields (kept for compatibility)
        supabaseUrl: 'http://34.142.248.160:5000',
        supabaseEndpoint: '/tts',
        supabaseAnonKey: '',
        // VPS Server Configuration
        serverUrl: 'http://34.142.248.160:5000',
        endpoint: '/tts',
        language: 'bn-IN',
        // Using Standard-B voice model for better Bengali number pronunciation
        voice: 'bn-IN-Standard-B',
        // Fallback to Web Speech API if server is unavailable
        fallbackToWebSpeech: true,
    },
    
    // Game display settings
    happyEmojis: ['🎉', '🎊', '🌟', '⭐', '✨', '🎯', '🏆', '🎪', '🎨', '🦄', '🌈', '🍭'],
    encourageEmojis: ['💪', '👍', '😊', '🤗', '💖', '🌺', '🌸', '🎀'],
    teddyBear: '🧸',
    
    // Messages
    celebrationMessages: [
        "অসাধারণ! 🎉 Excellent!",
        "দারুণ! 🌟 Amazing!",
        "খুব ভালো! ⭐ Great job!",
        "চমৎকার! 🎯 Wonderful!",
        "সাবাশ! 🏆 Well done!",
        "Perfect! 🦄 নিখুঁত!"
    ],
    tryAgainMessages: [
        "চেষ্টা করো! 💪 Try again!",
        "আবার চেষ্টা করো! 🌟 Keep trying!",
        "প্রায় হয়েছে! 🎯 Almost there!",
        "ভয় পেও না! 💖 Don't worry!"
    ]
};

export default config;
