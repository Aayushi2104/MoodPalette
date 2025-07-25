# Development Workflow Scripts

# Start both client and server in development mode
npm run dev

# Start individual services
npm run dev:client    # React app on port 3000
npm run dev:server     # Express server on port 5000

# Production commands
npm run build          # Build client for production
npm run start         # Start server in production mode

# Testing and quality
npm test              # Run tests for all workspaces
npm run lint          # Lint all code
npm run lint:fix      # Fix linting issues

# Utility commands
npm run clean         # Clean all dependencies
npm install           # Install all workspace dependencies