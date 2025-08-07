# Complete VPS Configuration Guide: Bengali Multiplication Game with Google Cloud TTS

This guide documents the exact steps we followed to successfully deploy the Bengali Multiplication Game with Google Cloud Text-to-Speech integration on a Google Cloud VPS.

## 🎯 **Overview**

We deployed a Node.js Express server on a Google Cloud VM that:
- Proxies requests to Google Cloud Text-to-Speech API
- Handles authentication using Google Cloud CLI
- Serves MP3 audio with proper CORS headers
- Caches audio files for performance
- Enables high-quality Bengali pronunciation for the game

## 📋 **Prerequisites**

- Google Cloud account with billing enabled
- A Google Cloud project (we used `cogent-dragon-468214-q7`)
- Basic knowledge of Linux command line
- SSH access to your VPS

## 🚀 **Step-by-Step VPS Configuration**

### **Step 1: Create and Access Google Cloud VM**

```bash
# Create a VM instance (via Google Cloud Console or CLI)
# Instance details used:
# - Name: instance-20250806-224047
# - Zone: Your preferred zone
# - Machine type: e2-micro (sufficient for TTS server)
# - OS: Ubuntu 20.04 LTS
# - Allow HTTP and HTTPS traffic

# SSH into your VM
gcloud compute ssh instance-20250806-224047 --zone=YOUR_ZONE
```

### **Step 2: Install Node.js and Dependencies**

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js (version 18+)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version

# Install Google Cloud CLI
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Initialize gcloud
gcloud init
```

### **Step 3: Set Up Project Directory**

```bash
# Create project directory
sudo mkdir -p /var/www/bengali-tts
cd /var/www/bengali-tts

# Change ownership to your user
sudo chown -R $USER:$USER /var/www/bengali-tts
```

### **Step 4: Create the TTS Server**

Create `server.js` with the following content:

```javascript
const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies
app.use(express.json());

// Handle preflight OPTIONS requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});

// Create cache directory
const cacheDir = path.join(__dirname, 'audio-cache');
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir);
}

// TTS endpoint
app.post('/tts', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  
  try {
    const { text, languageCode = 'bn-IN', voice = 'bn-IN-Standard-A' } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    console.log(`TTS Request: "${text}" (${languageCode}, ${voice})`);

    // Check cache first
    const cacheKey = `${text}_${languageCode}_${voice}`.replace(/[^a-zA-Z0-9]/g, '_');
    const cacheFile = path.join(cacheDir, `${cacheKey}.mp3`);
    
    if (fs.existsSync(cacheFile)) {
      console.log('Serving from cache');
      res.setHeader('Content-Type', 'audio/mpeg');
      return res.sendFile(cacheFile);
    }

    // Get access token
    const accessToken = await new Promise((resolve, reject) => {
      exec('gcloud auth print-access-token', (error, stdout, stderr) => {
        if (error) {
          console.error('Auth error:', error);
          reject(error);
        } else {
          resolve(stdout.trim());
        }
      });
    });

    // Prepare TTS request
    const requestPayload = {
      input: { text },
      voice: { languageCode, name: voice },
      audioConfig: { audioEncoding: 'MP3' }
    };

    // Call Google TTS API
    const curlCommand = `curl -s -X POST \\
      -H "Content-Type: application/json" \\
      -H "X-Goog-User-Project: cogent-dragon-468214-q7" \\
      -H "Authorization: Bearer ${accessToken.trim()}" \\
      --data '${JSON.stringify(requestPayload)}' \\
      "https://texttospeech.googleapis.com/v1/text:synthesize"`;

    const response = await new Promise((resolve, reject) => {
      exec(curlCommand, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
        if (error) {
          console.error('TTS API error:', error);
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });

    const result = JSON.parse(response);
    
    if (result.error) {
      console.error('TTS API returned error:', result.error);
      return res.status(500).json({ error: result.error.message });
    }

    if (!result.audioContent) {
      console.error('No audio content in response');
      return res.status(500).json({ error: 'No audio content received' });
    }

    // Decode base64 audio
    const audioBuffer = Buffer.from(result.audioContent, 'base64');
    
    // Cache the audio
    fs.writeFileSync(cacheFile, audioBuffer);
    
    // Send audio response
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(audioBuffer);
    
    console.log('TTS request completed successfully');

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`TTS Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

// Keep alive
setInterval(() => {
  console.log('Server alive:', new Date().toISOString());
}, 300000); // 5 minutes
```

### **Step 5: Install NPM Dependencies**

```bash
# Initialize npm project
npm init -y

# Install required packages
npm install express cors

# Create package.json if needed
cat > package.json << 'EOF'
{
  "name": "bengali-tts-server",
  "version": "1.0.0",
  "description": "Bengali TTS Server for Multiplication Game",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5"
  }
}
EOF
```

### **Step 6: Google Cloud Authentication Setup**

```bash
# Authenticate with Google Cloud (headless method)
gcloud auth login --no-browser

# This will give you a URL to visit on another machine with a browser
# Follow the instructions and paste the resulting URL back

# Set your project
gcloud config set project cogent-dragon-468214-q7

# Set up application default credentials
gcloud auth application-default login --no-browser

# Enable Text-to-Speech API
gcloud services enable texttospeech.googleapis.com

# Test authentication
gcloud auth print-access-token
```

### **Step 7: Configure Google Cloud Firewall**

```bash
# Create firewall rule to allow traffic on port 5000
gcloud compute firewall-rules create allow-tts-server \\
  --allow tcp:5000 \\
  --source-ranges 0.0.0.0/0 \\
  --description "Allow TTS server traffic"

# Verify firewall rule
gcloud compute firewall-rules list --filter="name:allow-tts-server"
```

### **Step 8: Test the API**

```bash
# Test Google TTS API directly
curl -X POST \\
  -H "Content-Type: application/json" \\
  -H "X-Goog-User-Project: cogent-dragon-468214-q7" \\
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \\
  --data '{"input":{"text":"এক"},"voice":{"languageCode":"bn-IN","name":"bn-IN-Standard-A"},"audioConfig":{"audioEncoding":"MP3"}}' \\
  "https://texttospeech.googleapis.com/v1/text:synthesize"

# Should return JSON with audioContent field
```

### **Step 9: Start the Server**

```bash
# Start the server
node server.js

# Server should start on port 5000
# You should see: "TTS Server running on port 5000"
```

### **Step 10: Test Server Endpoints**

```bash
# Test health endpoint
curl http://localhost:5000/health

# Test TTS endpoint locally
curl -X POST \\
  -H "Content-Type: application/json" \\
  -d '{"text":"এক","languageCode":"bn-IN","voice":"bn-IN-Standard-A"}' \\
  http://localhost:5000/tts

# Test from external IP (replace with your VM's external IP)
curl -X POST \\
  -H "Content-Type: application/json" \\
  -d '{"text":"এক","languageCode":"bn-IN","voice":"bn-IN-Standard-A"}' \\
  http://YOUR_EXTERNAL_IP:5000/tts
```

### **Step 11: Configure Frontend**

Update your frontend `config.ts` to use the VPS server:

```typescript
export const config = {
  tts: {
    enabled: true,
    serverUrl: 'http://YOUR_EXTERNAL_IP:5000',  // Replace with your VM's IP
    endpoint: '/tts',
    language: 'bn-IN',
    voice: 'bn-IN-Standard-A',
    fallbackToWebSpeech: true,
  }
};
```

## 🔧 **Production Optimizations**

### **Process Management with PM2**

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start server with PM2
pm2 start server.js --name "bengali-tts"

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME
```

### **HTTPS Setup with Nginx (Optional)**

```bash
# Install Nginx
sudo apt install nginx

# Install Certbot for Let's Encrypt
sudo apt install certbot python3-certbot-nginx

# Configure Nginx proxy (create /etc/nginx/sites-available/bengali-tts)
sudo tee /etc/nginx/sites-available/bengali-tts << 'EOF'
server {
    listen 80;
    server_name YOUR_DOMAIN.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/bengali-tts /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Get SSL certificate
sudo certbot --nginx -d YOUR_DOMAIN.com
```

## 🐛 **Troubleshooting**

### **Common Issues and Solutions**

1. **403 Permission Denied**
   ```bash
   # Re-authenticate with correct scopes
   gcloud auth login --no-browser
   gcloud auth application-default login --no-browser
   ```

2. **Port 5000 in use**
   ```bash
   # Kill existing process
   sudo lsof -ti:5000 | xargs kill -9
   # Or use different port
   export PORT=5001
   ```

3. **Firewall blocking requests**
   ```bash
   # Check firewall rules
   gcloud compute firewall-rules list
   # Create rule if missing
   gcloud compute firewall-rules create allow-tts-server --allow tcp:5000 --source-ranges 0.0.0.0/0
   ```

4. **CORS errors in browser**
   ```bash
   # Verify CORS headers in server response
   curl -I -X OPTIONS http://YOUR_IP:5000/tts
   ```

5. **No audio content in response**
   ```bash
   # Check if API is enabled
   gcloud services list --enabled --filter="name:texttospeech"
   # Enable if not listed
   gcloud services enable texttospeech.googleapis.com
   ```

## ✅ **Verification Checklist**

- [ ] VM created and accessible via SSH
- [ ] Node.js and npm installed
- [ ] Google Cloud CLI installed and authenticated
- [ ] Project set correctly (`cogent-dragon-468214-q7`)
- [ ] Text-to-Speech API enabled
- [ ] Firewall rule created for port 5000
- [ ] Server dependencies installed
- [ ] Server starts without errors
- [ ] Health endpoint responds
- [ ] TTS endpoint returns audio
- [ ] Frontend can access server from browser
- [ ] Bengali audio plays correctly in game

## 🎉 **Success Indicators**

When everything is working correctly:

1. **Server logs show**: "TTS Server running on port 5000"
2. **API test returns**: JSON with `audioContent` field
3. **Browser network tab shows**: Successful POST to `/tts` endpoint
4. **Game audio plays**: Clear Bengali pronunciation
5. **No CORS errors**: In browser console

## 📝 **Important Notes**

- Replace `YOUR_EXTERNAL_IP` with your actual VM external IP
- Replace `cogent-dragon-468214-q7` with your Google Cloud project ID
- Keep your VM running for the server to remain accessible
- Monitor Google Cloud billing for TTS API usage
- Audio files are cached locally to reduce API calls

This configuration has been tested and confirmed working for the Bengali Multiplication Game with Google Cloud Text-to-Speech integration.
