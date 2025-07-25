# MoodPalette Monorepo

A mood-based color palette generator with AI-powered suggestions and soothing animations.

## 🏗️ Monorepo Structure

This project uses npm workspaces to manage multiple packages:

```
moodpalette/
├── client/                 # React frontend (@moodpalette/client)
├── server/                 # Node.js backend (@moodpalette/server)
├── shared/                 # Shared utilities (@moodpalette/shared)
└── package.json           # Root workspace configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/moodpalette.git
cd moodpalette

# Install all dependencies for all workspaces
npm install
```

### Development

```bash
# Start both client and server in development mode
npm run dev

# Start only the client (React app on port 3000)
npm run dev:client

# Start only the server (Express API on port 5000)
npm run dev:server
```

### Building

```bash
# Build the client for production
npm run build

# Build only the client
npm run build:client
```

### Testing

```bash
# Run tests for all workspaces
npm test

# Run tests for specific workspace
npm run test:client
npm run test:server
```

## 📦 Workspaces

### @moodpalette/client
React frontend application featuring:
- Mood-based color palette generation
- Interactive color animations
- AI-powered suggestions
- User authentication and saved palettes

### @moodpalette/server
Node.js/Express backend API featuring:
- RESTful API endpoints
- MongoDB integration
- JWT authentication
- AI integration for color generation

### @moodpalette/shared
Shared utilities and constants:
- Color manipulation functions
- API endpoint constants
- Common types and interfaces
- Validation utilities

## 🛠️ Available Scripts

### Root Level Scripts
- `npm run dev` - Start both client and server
- `npm run build` - Build client for production
- `npm test` - Run all tests
- `npm run lint` - Lint all workspaces
- `npm run clean` - Clean all node_modules

### Workspace-Specific Scripts
- `npm run dev:client` - Start React development server
- `npm run dev:server` - Start Express server with nodemon
- `npm run test:client` - Run client tests
- `npm run test:server` - Run server tests

## 🔧 Environment Variables

Create `.env` files in the appropriate workspaces:

### Server (.env in /server)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/moodpalette
JWT_SECRET=your-secret-key
GOOGLE_AI_API_KEY=your-google-ai-key
```

### Client (.env in /client)
```
REACT_APP_API_URL=http://localhost:5000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes in the appropriate workspace
4. Run tests and linting
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details.#   M o o d P a l e t t e  
 