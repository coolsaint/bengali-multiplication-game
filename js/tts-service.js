/**
 * Text-to-Speech service using Google TTS via Supabase Edge Function
 */
const ttsService = {
    // Audio element for TTS playback
    audioElement: null,
    
    // Flag to indicate if TTS is available
    isAvailable: false,
    
    // Flag to indicate if TTS is enabled in config
    isEnabled: false,
    
    /**
     * Initialize TTS service
     */
    init: function() {
        this.isEnabled = config.tts.enabled;
        
        if (!this.isEnabled) {
            console.log('TTS is disabled in config');
            return;
        }
        
        // Create audio element for playback
        this.audioElement = document.createElement('audio');
        this.audioElement.style.display = 'none';
        document.body.appendChild(this.audioElement);
        
        // Check if Supabase URL and key are configured
        if (!config.tts.supabaseUrl || !config.tts.supabaseAnonKey) {
            console.error('Supabase URL or Anon Key not configured');
            return;
        }
        
        this.isAvailable = true;
        console.log('TTS service initialized');
    },
    
    /**
     * Speak Bengali text using Google TTS
     * @param {string} text - Bengali text to speak
     */
    speak: async function(text) {
        if (!this.isEnabled || !this.isAvailable) {
            return;
        }
        
        try {
            const response = await fetch(`${config.tts.supabaseUrl}${config.tts.supabaseEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.tts.supabaseAnonKey}`
                },
                body: JSON.stringify({
                    text: text,
                    languageCode: config.tts.language,
                    voice: config.tts.voice
                })
            });
            
            if (!response.ok) {
                throw new Error('TTS request failed');
            }
            
            // Get audio data as blob
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            
            // Clean up previous URL if exists
            if (this.audioElement.src) {
                URL.revokeObjectURL(this.audioElement.src);
            }
            
            // Set new audio source and play
            this.audioElement.src = audioUrl;
            
            // Setup event handlers
            this.audioElement.onended = () => {
                URL.revokeObjectURL(audioUrl);
            };
            
            // Play the audio
            this.audioElement.play();
        } catch (error) {
            console.error('Google TTS error:', error);
        }
    },
    
    /**
     * Speak a multiplication question in Bengali
     * @param {number} num1 - First number 
     * @param {number} num2 - Second number
     */
    speakMultiplication: function(num1, num2) {
        const text = bengaliUtils.getMultiplicationText(num1, num2);
        this.speak(text);
    },
    
    /**
     * Speak a number in Bengali
     * @param {number} num - Number to speak
     */
    speakNumber: function(num) {
        const text = bengaliUtils.getBengaliWord(num);
        this.speak(text);
    }
};
