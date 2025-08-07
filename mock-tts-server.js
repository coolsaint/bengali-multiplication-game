/**
 * Mock TTS Server to simulate Supabase Edge Function during development
 * Install dependencies: npm install express cors
 * Run with: node mock-tts-server.js
 */

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 54321;

// Enable CORS for all requests
app.use(cors());
app.use(express.json());

// Create functions/v1/tts endpoint
app.post('/functions/v1/tts', (req, res) => {
  console.log('Received TTS request:', req.body);
  
  // Extract request details
  const { text, languageCode, voice } = req.body;
  
  console.log(`Text: ${text}, Language: ${languageCode}, Voice: ${voice}`);
  
  // For testing, we'll return a simple audio file
  // You should replace this with a path to a test MP3 file on your system
  const audioFilePath = path.join(__dirname, 'test-audio.mp3');
  
  if (fs.existsSync(audioFilePath)) {
    // If the test audio file exists, send it
    res.setHeader('Content-Type', 'audio/mpeg');
    fs.createReadStream(audioFilePath).pipe(res);
  } else {
    // If no test audio file exists, create a sample response
    console.warn('No test audio file found at', audioFilePath);
    console.warn('Returning empty audio response');
    
    // Create a minimal valid MP3 header (not actually playable)
    const buffer = Buffer.from([
      0xFF, 0xFB, 0x90, 0x44, 0x00, 0x00, 0x00, 0x00,  
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
    ]);
    
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(buffer);
  }
});

app.listen(PORT, () => {
  console.log(`Mock TTS server running at http://localhost:${PORT}`);
  console.log(`TTS endpoint: http://localhost:${PORT}/functions/v1/tts`);
  console.log('Send POST requests with: { "text": "your text", "languageCode": "bn-IN", "voice": "bn-IN-Standard-A" }');
});
