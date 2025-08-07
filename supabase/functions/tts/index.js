// Supabase Edge Function for Google TTS Integration
// This file should be placed in your Supabase project's functions/tts/index.js

// Import the Google Cloud Text-to-Speech client
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

// Set up CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Configure this appropriately for production
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS requests for CORS preflight
const handleCors = (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
};

// Main handler function for the Supabase Edge Function
export const handler = async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Parse request body for TTS parameters
    const { text, languageCode = 'bn-IN', voice = 'bn-IN-Standard-A' } = await req.json();

    // Validate required parameters
    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Text parameter is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Google Cloud Text-to-Speech client
    // Note: Credentials are automatically loaded from environment variables
    const client = new TextToSpeechClient();

    // Prepare the TTS request
    const request = {
      input: { text },
      voice: { languageCode, name: voice },
      audioConfig: { audioEncoding: 'MP3' },
    };

    // Call Google TTS API
    const [response] = await client.synthesizeSpeech(request);

    // Return the audio content with appropriate headers
    return new Response(response.audioContent, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error('Google TTS API error:', error);
    
    // Return error response
    return new Response(
      JSON.stringify({ error: 'Failed to generate speech', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
};
