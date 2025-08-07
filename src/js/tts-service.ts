/**
 * Text-to-Speech service for Bengali Multiplication Game
 * Supports both Google TTS server (local/VPS) and Web Speech API fallback
 */

import config from './config.js';
import bengaliUtils from './bengali-utils.js';

interface TTSService {
    audioElement: HTMLAudioElement | null;
    isAvailable: boolean;
    isEnabled: boolean;
    init(): void;
    speak(text: string): Promise<void>;
    speakMultiplication(num1: number, num2: number): void;
    speakNumber(num: number): void;
    speakWithGoogleTTS(text: string): Promise<void>;
    speakWithWebSpeechAPI(text: string): void;
}

const ttsService: TTSService = {
    // Audio element for TTS playback
    audioElement: null,
    
    // Flag to indicate if TTS is available
    isAvailable: false,
    
    // Flag to indicate if TTS is enabled in config
    isEnabled: false,
    
    /**
     * Initialize TTS service
     */
    init(): void {
        this.isEnabled = config.tts.enabled;
        
        if (!this.isEnabled) {
            console.log('TTS is disabled in config');
            return;
        }
        
        // Create audio element for playback
        this.audioElement = document.createElement('audio');
        this.audioElement.style.display = 'none';
        document.body.appendChild(this.audioElement);
        
        // Set as available and test connection
        this.isAvailable = true;
        console.log('TTS service initialized (using Google Cloud TTS)');
    },
    
    /**
     * Speak Bengali text using Google TTS server or Web Speech API fallback
     * @param text - Bengali text to speak
     */
    async speak(text: string): Promise<void> {
        if (!this.isEnabled || !this.isAvailable) {
            return;
        }
        
        // Try Google TTS server first, fallback to Web Speech API
        try {
            await this.speakWithGoogleTTS(text);
        } catch (error) {
            console.warn('Google TTS failed, falling back to Web Speech API:', error);
            if (config.tts.fallbackToWebSpeech) {
                this.speakWithWebSpeechAPI(text);
            }
        }
    },
    
    /**
     * Speak using Google TTS server (local or VPS)
     */
    async speakWithGoogleTTS(text: string): Promise<void> {
        console.log(`Speaking Bengali text: "${text}" using Google Cloud TTS`);
        
        // Disable caching - generate fresh audio for every request
        const timestamp = Date.now();
        const response = await fetch(`${config.tts.serverUrl}${config.tts.endpoint}?nocache=${timestamp}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                languageCode: config.tts.language,
                voice: config.tts.voice,
                nocache: timestamp
            })
        });
        
        if (!response.ok) {
            throw new Error(`Google TTS request failed: ${response.status}`);
        }
        
        // Get audio data as blob
        const audioBlob = await response.blob();
        console.log(`Received audio blob of size: ${audioBlob.size} bytes for text: "${text}"`);
        
        // Clean up previous audio URL to prevent caching
        if (this.audioElement && this.audioElement.src && this.audioElement.src.startsWith('blob:')) {
            URL.revokeObjectURL(this.audioElement.src);
        }
        
        // Create new audio URL and play
        const audioUrl = URL.createObjectURL(audioBlob);
        if (this.audioElement) {
            this.audioElement.src = audioUrl;
            console.log(`Created new audio URL for: "${text}"`);
            
            try {
                // Force reload the audio element to prevent browser caching
                this.audioElement.load();
                await this.audioElement.play();
                console.log(`Google TTS audio played successfully for: "${text}"`);
            } catch (error) {
                console.error('Error playing Google TTS audio:', error);
                throw error;
            }
        }
    },
    
    /**
     * Speak using browser Web Speech API as fallback
     */
    speakWithWebSpeechAPI(text: string): void {
        console.log(`Speaking Bengali text: "${text}" using Web Speech API`);
        
        // Check if Web Speech API is available
        if (!window.speechSynthesis) {
            console.warn('Web Speech API not available');
            return;
        }
        
        // Create speech utterance
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = config.tts.language; // 'bn-IN'
        utterance.rate = 0.8; // Slightly slower for clarity
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        // Try to find a Bengali voice
        const voices = window.speechSynthesis.getVoices();
        const bengaliVoice = voices.find(voice => 
            voice.lang.startsWith('bn') || 
            voice.lang.startsWith('hi') || // Hindi as fallback
            voice.name.toLowerCase().includes('bengali')
        );
        
        if (bengaliVoice) {
            utterance.voice = bengaliVoice;
            console.log(`Using voice: ${bengaliVoice.name} (${bengaliVoice.lang})`);
        } else {
            console.log('No Bengali voice found, using default voice');
        }
        
        // Speak the text
        window.speechSynthesis.speak(utterance);
    },
    
    /**
     * Speak a multiplication question in Bengali
     * @param num1 - First number 
     * @param num2 - Second number
     */
    speakMultiplication(num1: number, num2: number): void {
        const text = bengaliUtils.getMultiplicationText(num1, num2);
        this.speak(text);
    },
    
    /**
     * Speak a number in Bengali
     * @param num - Number to speak
     */
    speakNumber(num: number): void {
        const text = bengaliUtils.getBengaliWord(num);
        this.speak(text);
    }
};

export default ttsService;
