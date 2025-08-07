/**
 * Google Cloud TTS Server for Bengali Multiplication Game
 * 
 * This server proxies requests to Google Cloud TTS API using direct API calls
 * Run with: node google-tts-server.js
 * 
 * Authenticated with: gcloud auth login (suman@arya.com.bd)
 * Project ID: focus-invention-420715
 */

import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import util from 'util';

// Convert exec to promise-based version
const execPromise = util.promisify(exec);

// Create Express app
const app = express();
const PORT = 5000;

// Simple CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    // Handle preflight
    return res.status(204).send();
  }
  next();
});

app.use(express.json());

app.post('/tts', async (req, res) => {
  try {
    // Get request parameters
    const { text, languageCode = 'bn-IN', voice = 'bn-IN-Chirp3-HD-Achernar' } = req.body;
    
    // Log the request
    console.log(`TTS Request: "${text}" (${languageCode}, ${voice})`);
    
    try {
      // Hardcoded project ID from authentication
      const projectId = 'focus-invention-420715';
      
      // Get the access token
      const { stdout: accessToken } = await execPromise('gcloud auth print-access-token');
      
      // Create the request payload
      const requestPayload = {
        input: {
          markup: text
        },
        voice: {
          languageCode,
          name: voice,
          voiceClone: {}
        },
        audioConfig: {
          audioEncoding: 'MP3'
        }
      };
      
      // Create a unique filename for caching
      const hash = Buffer.from(`${text}-${voice}`).toString('base64').replace(/[/\+=]/g, '_');
      const cacheFilePath = path.join(cacheDir, `${hash}.mp3`);
      
      // Check if we have a cached version
      if (fs.existsSync(cacheFilePath)) {
        console.log(`Using cached audio for: "${text}"`);
        const audioData = fs.readFileSync(cacheFilePath);
        res.set('Content-Type', 'audio/mpeg');
        res.set('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
        return res.send(audioData);
      }
      
      // Make the curl command
      const curlCommand = `curl -s -X POST \
        -H "Content-Type: application/json" \
        -H "X-Goog-User-Project: ${projectId}" \
        -H "Authorization: Bearer ${accessToken.trim()}" \
        --data '${JSON.stringify(requestPayload)}' \
        "https://texttospeech.googleapis.com/v1/text:synthesize"`;
      
      console.log(`Sending request to Google TTS API for project: ${projectId}`);
      
      // Execute the curl command
      const { stdout } = await execPromise(curlCommand);
      
      // Parse the response
      const response = JSON.parse(stdout);
      
      // The audioContent is base64-encoded
      const audioContent = Buffer.from(response.audioContent, 'base64');
      
      // Save to cache
      fs.writeFileSync(cacheFilePath, audioContent);
      
      // Set appropriate headers
      res.set('Content-Type', 'audio/mpeg');
      res.set('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
      
      // Send audio data
      res.send(audioContent);
    } catch (error) {
      console.error('Error calling Google TTS API:', error);
      res.status(500).send(`Error calling Google TTS API: ${error.message}`);
    }

  } catch (error) {
    console.error('Google TTS error:', error);
    res.status(500).json({ error: 'Failed to synthesize speech', details: error.message });
  }
});

// Handle audio cache folder
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cacheDir = path.join(__dirname, 'audio-cache');

// Create cache directory if it doesn't exist
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir);
}

// Start the server and keep it alive
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Google TTS Server running at http://localhost:${PORT}`);
  console.log(`TTS endpoint: http://localhost:${PORT}/tts`);
  console.log('Send POST requests with: { "text": "your text", "languageCode": "bn-IN", "voice": "bn-IN-Chirp3-HD-Achernar" }');
  
  // Check if authenticated with gcloud
  exec('gcloud auth print-access-token', (error) => {
    if (error) {
      console.warn('WARNING: You are not authenticated with gcloud.');
      console.warn('Authenticate with: gcloud auth login');
    } else {
      console.log('Successfully authenticated with gcloud as suman@arya.com.bd');
      console.log('Using Google Cloud project: focus-invention-420715');
    }
  });
});

// Keep the process alive
setInterval(() => {
  // This keeps the Node.js process alive
}, 60000);

console.log('Server setup complete, ready to handle requests...');
