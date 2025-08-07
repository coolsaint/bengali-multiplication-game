# Bengali Multiplication Game with Google Cloud TTS

A TypeScript-based educational game for children to learn Bengali numbers through interactive multiplication exercises with high-quality text-to-speech pronunciation.

## 🎯 Features

- **Interactive Multiplication Game**: Practice multiplication tables 1-10
- **Bengali Number Learning**: Visual and audio Bengali number representation
- **Google Cloud TTS Integration**: High-quality Bengali pronunciation using `bn-IN-Standard-A` voice
- **TypeScript Implementation**: Type-safe, modular codebase
- **Responsive Design**: Works on desktop and mobile devices
- **Audio Caching**: Server-side caching for improved performance
- **CORS-Enabled**: Cross-origin requests supported for web deployment

## 🏗️ Architecture

### Frontend (TypeScript)
- **Game Manager**: Core game logic and state management
- **UI Manager**: User interface controls and visual feedback
- **TTS Service**: Text-to-speech integration with fallback support
- **Question Generator**: Dynamic multiplication question creation
- **Bengali Utils**: Number conversion and Bengali text utilities

### Backend (Node.js)
- **Express Server**: RESTful API for TTS requests
- **Google Cloud Integration**: Direct API calls to Text-to-Speech service
- **Audio Caching**: Local MP3 file caching for performance
- **CORS Support**: Cross-origin request handling

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bengali-numbers-game
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build TypeScript**
   ```bash
   npm run build
   ```

4. **Serve locally**
   ```bash
   npm run serve
   ```

5. **Open in browser**
   ```
   http://localhost:8080
   ```

### Production Deployment

For production deployment with Google Cloud TTS, see the detailed [VPS Deployment Guide](./VPS-DEPLOYMENT-GUIDE.md).

## 🔧 Configuration

### Frontend Configuration (`src/js/config.ts`)

```typescript
export const config = {
  tts: {
    enabled: true,
    serverUrl: 'http://YOUR_VPS_IP:5000',  // Your TTS server URL
    endpoint: '/tts',
    language: 'bn-IN',
    voice: 'bn-IN-Standard-A',
    fallbackToWebSpeech: true,
  },
  game: {
    maxNumber: 10,
    questionsPerRound: 5,
    timeLimit: 30000, // 30 seconds
  }
};
```

### Server Configuration

The TTS server requires:
- Google Cloud CLI authentication
- Text-to-Speech API enabled
- Proper firewall configuration (port 5000)

## 📁 Project Structure

```
bengali-numbers-game/
├── src/
│   ├── index.html              # Main HTML file
│   ├── css/
│   │   └── style.css          # Game styling
│   └── js/
│       ├── config.ts          # Configuration settings
│       ├── bengali-utils.ts   # Bengali number utilities
│       ├── tts-service.ts     # Text-to-speech service
│       ├── ui-manager.ts      # UI management
│       ├── question-generator.ts # Question generation
│       ├── game-manager.ts    # Game logic
│       └── main.ts           # Application entry point
├── server.js                  # TTS proxy server
├── google-tts-server.js      # Alternative server implementation
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── netlify.toml              # Netlify deployment config
├── VPS-DEPLOYMENT-GUIDE.md   # Detailed deployment guide
└── README.md                 # This file
```

## 🎮 How to Play

1. **Start the Game**: Click "নতুন খেলা" (New Game)
2. **Listen to Question**: Audio plays the multiplication question in Bengali
3. **Select Answer**: Choose from multiple choice options
4. **Get Feedback**: Immediate audio and visual feedback
5. **Progress**: Complete rounds to advance difficulty

## 🔊 Audio Features

- **Bengali Number Pronunciation**: Numbers 1-10 in Bengali
- **Question Reading**: Full multiplication questions read aloud
- **Answer Feedback**: Audio confirmation of correct/incorrect answers
- **Fallback Support**: Browser Web Speech API if server unavailable

## 🛠️ Development

### Available Scripts

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Watch for changes (development)
npm run watch

# Serve locally
npm run serve

# Start TTS server
npm run server

# Deploy to Netlify
npm run deploy
```

### TypeScript Build

The project uses TypeScript for type safety and better development experience:

```bash
# Compile TypeScript to JavaScript
tsc

# Watch mode for development
tsc --watch
```

## 🌐 Deployment Options

### Static Hosting (Frontend Only)
- **Netlify**: Automatic deployment from Git
- **Vercel**: Zero-config deployment
- **GitHub Pages**: Free static hosting

### Full Stack (Frontend + TTS Server)
- **Google Cloud VM**: Complete control and Google TTS integration
- **DigitalOcean**: VPS with Node.js support
- **AWS EC2**: Scalable cloud deployment

See [VPS-DEPLOYMENT-GUIDE.md](./VPS-DEPLOYMENT-GUIDE.md) for detailed server setup instructions.

## 🔐 Authentication

The TTS server requires Google Cloud authentication:

1. **Install Google Cloud CLI**
2. **Authenticate**: `gcloud auth login --no-browser`
3. **Set Project**: `gcloud config set project YOUR_PROJECT_ID`
4. **Enable API**: `gcloud services enable texttospeech.googleapis.com`

## 📊 Performance

- **Audio Caching**: MP3 files cached on server for repeated requests
- **Lazy Loading**: Components loaded as needed
- **Optimized Assets**: Minified CSS and JavaScript
- **CDN Ready**: Static assets can be served from CDN

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure server has proper CORS headers
2. **No Audio**: Check TTS server status and authentication
3. **Build Errors**: Verify TypeScript configuration
4. **Server 403**: Confirm Google Cloud project permissions

### Debug Commands

```bash
# Test TTS server health
curl http://YOUR_SERVER:5000/health

# Test TTS endpoint
curl -X POST -H "Content-Type: application/json" \
  -d '{"text":"এক","languageCode":"bn-IN"}' \
  http://YOUR_SERVER:5000/tts

# Check server logs
pm2 logs bengali-tts
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make changes and test thoroughly
4. Commit changes: `git commit -m "Add feature"`
5. Push to branch: `git push origin feature-name`
6. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Google Cloud Text-to-Speech**: High-quality Bengali voice synthesis
- **Bengali Language Support**: Native Bengali number system
- **Educational Focus**: Designed for children's learning experience

## 📞 Support

For deployment issues or questions:
1. Check the [VPS Deployment Guide](./VPS-DEPLOYMENT-GUIDE.md)
2. Review troubleshooting section above
3. Open an issue with detailed error information

---

**Built with ❤️ for Bengali-speaking children learning mathematics**
