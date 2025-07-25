# MoodPalette Deployment Guide

## 📋 Overview
This guide covers deploying both the backend server and frontend client using environment variables for different hosting platforms.

## 🔧 Environment Configuration

### Backend Server Environment Variables

#### Development (.env)
```bash
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/moodpalette
JWT_SECRET=your-dev-jwt-secret
REFRESH_TOKEN_SECRET=your-dev-refresh-secret
GOOGLE_AI_API_KEY=your-google-ai-key
OPENAI_API_KEY=your-openai-key
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

#### Production (.env.production template)
- Copy `.env.production` to `.env`
- Update all placeholder values with your production credentials
- Use strong, unique secrets for JWT tokens
- Set production MongoDB connection string
- Configure CORS origins for your frontend domain

### Frontend Client Environment Variables

#### Development (.env)
```bash
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_ENV=development
```

#### Production (.env.production template)
- Copy `.env.production` to `.env`
- Update `REACT_APP_API_BASE_URL` with your deployed backend URL

## 🚀 Hosting Platforms

### Backend Deployment Options

#### 1. Heroku
```bash
# Install Heroku CLI and login
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="your-mongodb-connection-string"
heroku config:set JWT_SECRET="your-jwt-secret"
heroku config:set REFRESH_TOKEN_SECRET="your-refresh-secret"
heroku config:set GOOGLE_AI_API_KEY="your-google-ai-key"
heroku config:set OPENAI_API_KEY="your-openai-key"
heroku config:set ALLOWED_ORIGINS="https://your-frontend-domain.com"
git push heroku main
```

#### 2. Railway
```bash
# Install Railway CLI
railway login
railway new
railway add
# Set environment variables in Railway dashboard
railway deploy
```

#### 3. Render
- Connect your GitHub repository
- Set environment variables in Render dashboard
- Deploy automatically on git push

### Frontend Deployment Options

#### 1. Vercel
```bash
# Install Vercel CLI
npm i -g vercel
vercel
# Set environment variables in Vercel dashboard:
# REACT_APP_API_BASE_URL=https://your-backend-domain.com
```

#### 2. Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli
netlify deploy --prod
# Set environment variables in Netlify dashboard
```

#### 3. GitHub Pages (Static hosting)
- Build the project: `npm run build`
- Deploy the `build` folder
- Note: Environment variables must be set during build time

## 🔐 Security Checklist

### Backend Security
- [ ] Use strong, unique JWT secrets (min 32 characters)
- [ ] Enable HTTPS in production
- [ ] Configure CORS for specific domains only
- [ ] Use environment variables for all secrets
- [ ] Enable MongoDB authentication
- [ ] Set up rate limiting (consider adding express-rate-limit)
- [ ] Use BCRYPT_SALT_ROUNDS=12 or higher for production

### Frontend Security
- [ ] Only expose necessary environment variables (REACT_APP_ prefix)
- [ ] Use HTTPS for API calls
- [ ] Validate all user inputs
- [ ] Implement proper error handling
- [ ] Never expose sensitive backend URLs in client code

## 🛠️ Development Scripts

### Start Development Environment
```bash
# Root directory
npm run dev  # Starts both client and server

# Or individually
npm run dev:server  # Backend only
npm run dev:client  # Frontend only
```

### Production Build
```bash
# Frontend
cd client
npm run build

# Backend (no build needed, just ensure environment is set)
cd server
NODE_ENV=production node server.js
```

## 🔄 Environment Variable Reference

### Required Backend Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `production` |
| `MONGODB_URI` | Database connection | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `REFRESH_TOKEN_SECRET` | Refresh token secret | `your-refresh-secret` |
| `ALLOWED_ORIGINS` | CORS origins | `https://yourdomain.com` |

### Optional Backend Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `GOOGLE_AI_API_KEY` | Google AI API key | None |
| `OPENAI_API_KEY` | OpenAI API key | None |
| `BCRYPT_SALT_ROUNDS` | Password hashing rounds | `10` |
| `ACCESS_TOKEN_EXPIRY` | Access token expiry | `15m` |
| `REFRESH_TOKEN_EXPIRY` | Refresh token expiry | `7d` |

### Required Frontend Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_BASE_URL` | Backend API URL | `https://api.yourdomain.com` |

## 🏥 Health Checks

The backend includes a health check endpoint:
- **URL**: `/health`
- **Method**: GET
- **Response**: `{"status": "healthy", "timestamp": "2025-01-XX..."}`

Use this endpoint for:
- Load balancer health checks
- Monitoring services
- Deployment verification

## 🐛 Troubleshooting

### Common Issues

#### CORS Errors
- Ensure `ALLOWED_ORIGINS` includes your frontend domain
- Check that frontend is using correct backend URL
- Verify HTTPS/HTTP protocol matching

#### Database Connection
- Verify MongoDB connection string
- Check network access (IP whitelist for MongoDB Atlas)
- Ensure database user has proper permissions

#### Environment Variables Not Loading
- Verify `.env` file is in correct directory
- Check environment variable names (typos)
- Ensure hosting platform has variables configured
- Remember: Frontend vars must start with `REACT_APP_`

#### AI Features Not Working
- Verify API keys are set correctly
- Check API quotas and billing
- Review error logs for specific API errors

## 📚 Additional Resources

- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com/)
- [Heroku Node.js Deployment](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Netlify Environment Variables](https://docs.netlify.com/configure-builds/environment-variables/)

## 🔗 Quick Links

- Development: `http://localhost:3000` (frontend), `http://localhost:5000` (backend)
- API Documentation: `https://your-backend-domain.com/` (basic info)
- Health Check: `https://your-backend-domain.com/health`