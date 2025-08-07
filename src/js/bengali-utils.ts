/**
 * Interfaces for Bengali utils module
 */
interface BengaliWordsType {
  [key: number]: string;
}

/**
 * Utilities for Bengali number conversions and pronunciation
 */

import config from './config.js';
const bengaliUtils = {
    // Bengali digit characters
    bengaliDigits: ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'],
    
    /**
     * Convert numeric digits to Bengali digits
     * @param num - Number to convert
     * @returns Bengali number representation
     */
    toBengaliNumber(num: number): string {
        return num.toString().split('').map(digit => 
            this.bengaliDigits[parseInt(digit)]
        ).join('');
    },
    
    /**
     * Get Bengali word for a number (for pronunciation)
     * @param num - Number to convert
     * @returns Bengali word
     */
    getBengaliWord(num: number): string {
        const bengaliWords: BengaliWordsType = {
            0: 'শূন্য', 1: 'এক', 2: 'দুই', 3: 'তিন', 4: 'চার',
            5: 'পাঁচ', 6: 'ছয়', 7: 'সাত', 8: 'আট', 9: 'নয়',
            10: 'দশ', 11: 'এগারো', 12: 'বারো', 13: 'তেরো', 14: 'চৌদ্দ',
            15: 'পনেরো', 16: 'ষোলো', 17: 'সতেরো', 18: 'আঠারো', 19: 'উনিশ',
            20: 'বিশ', 21: 'একুশ', 22: 'বাইশ', 23: 'তেইশ', 24: 'চব্বিশ',
            25: 'পঁচিশ', 26: 'ছাব্বিশ', 27: 'সাতাশ', 28: 'আঠাশ', 29: 'ঊনত্রিশ',
            30: 'ত্রিশ', 31: 'একত্রিশ', 32: 'বত্রিশ', 33: 'তেত্রিশ', 34: 'চৌত্রিশ',
            35: 'পঁয়ত্রিশ', 36: 'ছত্রিশ', 37: 'সাঁইত্রিশ', 38: 'আঠত্রিশ', 39: 'ঊনচল্লিশ',
            40: 'চল্লিশ', 41: 'একচল্লিশ', 42: 'বিয়াল্লিশ', 43: 'তেতাল্লিশ', 44: 'চুয়াল্লিশ',
            45: 'পঁয়তাল্লিশ', 46: 'ছেচল্লিশ', 47: 'সাতচল্লিশ', 48: 'আঠচল্লিশ', 49: 'ঊনপঞ্চাশ',
            50: 'পঞ্চাশ', 51: 'একান্ন', 52: 'বাহান্ন', 53: 'তিপ্পান্ন', 54: 'চুয়ান্ন',
            55: 'পঞ্চান্ন', 56: 'ছাপ্পান্ন', 57: 'সাতান্ন', 58: 'আঠান্ন', 59: 'ঊনষাট',
            60: 'ষাট', 61: 'একষট্টি', 62: 'বাষট্টি', 63: 'তেষট্টি', 64: 'চৌষট্টি',
            65: 'পঁয়ষট্টি', 66: 'ছেষট্টি', 67: 'সাতষট্টি', 68: 'আঠষট্টি', 69: 'ঊনসত্তর',
            70: 'সত্তর', 71: 'একাত্তর', 72: 'বাহাত্তর', 73: 'তিয়াত্তর', 74: 'চুয়াত্তর',
            75: 'পঁচাত্তর', 76: 'ছিয়াত্তর', 77: 'সাতাত্তর', 78: 'আঠাত্তর', 79: 'ঊনআশি',
            80: 'আশি', 81: 'একাশি', 82: 'বিরাশি', 83: 'তিরাশি', 84: 'চুরাশি',
            85: 'পঁচাশি', 86: 'ছিয়াশি', 87: 'সাতাশি', 88: 'আঠাশি', 89: 'ঊননব্বই',
            90: 'নব্বই', 91: 'একানব্বই', 92: 'বিরানব্বই', 93: 'তিরানব্বই', 94: 'চুরানব্বই',
            95: 'পঁচানব্বই', 96: 'ছিয়ানব্বই', 97: 'সাতানব্বই', 98: 'আঠানব্বই', 99: 'নিরানব্বই',
            100: 'একশত', 101: 'একশত এক', 102: 'একশত দুই', 103: 'একশত তিন', 104: 'একশত চার',
            105: 'একশত পাঁচ', 106: 'একশত ছয়', 107: 'একশত সাত', 108: 'একশত আঠ', 109: 'একশত নয়',
            110: 'একশত দশ', 111: 'একশত এগারো', 112: 'একশত বারো', 113: 'একশত তেরো', 114: 'একশত চৌদ্দ',
            115: 'একশত পনেরো', 116: 'একশত ষোলো', 117: 'একশত সতেরো', 118: 'একশত আঠারো', 119: 'একশত উনিশ',
            120: 'একশত বিশ', 121: 'একশত একুশ', 144: 'একশত চুয়াল্লিশ', 169: 'একশত ঊনসত্তর',
            200: 'দুইশত', 225: 'দুইশত পঁচিশ', 256: 'দুইশত ছাপ্পান্ন', 289: 'দুইশত ঊননব্বই',
            300: 'তিনশত', 324: 'তিনশত চব্বিশ', 361: 'তিনশত একষট্টি', 400: 'চারশত'
        };
        
        // Handle numbers above 400 with basic construction
        if (num > 400 && num < 1000) {
            const hundreds = Math.floor(num / 100);
            const remainder = num % 100;
            const hundredWord = this.getBengaliWord(hundreds) + 'শত';
            if (remainder === 0) {
                return hundredWord;
            } else {
                return hundredWord + ' ' + this.getBengaliWord(remainder);
            }
        }
        
        return bengaliWords[num] || num.toString();
    },
    
    /**
     * Generate text for multiplication question in Bengali
     * @param num1 - First number
     * @param num2 - Second number
     * @returns Bengali text for TTS
     */
    getMultiplicationText(num1: number, num2: number): string {
        return `${this.getBengaliWord(num1)} গুন ${this.getBengaliWord(num2)} সমান কত?`;
    },
    
    /**
     * Get random teddy bear emojis for visual representation
     * @param count - Number of emojis to generate
     * @returns String with teddy bear emojis
     */
    getTeddyBears(count: number): string {
        let charString = '';
        for (let i = 0; i < count; i++) {
            // Note: config will be imported separately
            charString += config.teddyBear + ' ';
        }
        return charString.trim();
    }
};

// For TypeScript modules, we need to export
export default bengaliUtils;
