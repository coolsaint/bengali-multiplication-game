/**
 * Configuration settings for Bengali Multiplication Magic game
 */
const config = {
    // Game settings
    totalQuestions: 20, // 10 questions per stage, 2 stages
    questionsPerStage: 10,
    stages: 2,
    
    // Google TTS settings via Supabase
    tts: {
        enabled: true,
        supabaseUrl: 'YOUR_SUPABASE_URL', // Replace with actual Supabase URL
        supabaseEndpoint: '/functions/v1/tts',
        supabaseAnonKey: 'YOUR_SUPABASE_ANON_KEY', // Replace with actual Anon Key
        language: 'bn-IN',
        voice: 'bn-IN-Standard-A',
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
