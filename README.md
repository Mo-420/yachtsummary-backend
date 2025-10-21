# 🚢 YachtSummary Backend - Push Notification Server

Complete backend server for YachtSummary PWA with Web Push Notification support for iOS, Android, and Desktop.

## Features

✅ **Web Push Notifications** - Send notifications to users on iOS, Android, and Desktop
✅ **User Subscriptions** - Manage user push subscriptions
✅ **Broadcast Messaging** - Send notifications to all users at once
✅ **Lead Notifications** - Specialized notifications for new yacht charter leads
✅ **Health Monitoring** - Built-in health checks and statistics
✅ **CORS Enabled** - Ready for production deployment
✅ **Environment Configuration** - Secure VAPID key management

## Quick Start

### Prerequisites
- Node.js 14+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Configure VAPID keys (already set in .env)
# If needed, generate new keys:
npx web-push generate-vapid-keys
```

### Running Locally

```bash
# Start the development server
npm run dev

# Or with specific port
PORT=5000 npm start
```

The backend will be available at `http://localhost:5000`

## API Endpoints

### Health & Configuration

#### `GET /health`
Check if backend is running
```bash
curl http://localhost:5000/health
```

#### `GET /vapid-public-key`
Get the VAPID public key (needed by frontend)
```bash
curl http://localhost:5000/vapid-public-key
```

### Subscription Management

#### `POST /subscribe`
Subscribe a user to push notifications
```bash
curl -X POST http://localhost:5000/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user@example.com",
    "subscription": {
      "endpoint": "https://fcm.googleapis.com/fcm/...",
      "keys": {
        "p256dh": "...",
        "auth": "..."
      }
    }
  }'
```

#### `POST /unsubscribe`
Unsubscribe a user from push notifications
```bash
curl -X POST http://localhost:5000/unsubscribe \
  -H "Content-Type: application/json" \
  -d '{"userId": "user@example.com"}'
```

### Sending Notifications

#### `POST /send-notification`
Send a notification to a specific user
```bash
curl -X POST http://localhost:5000/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user@example.com",
    "title": "New Lead",
    "body": "John Smith is interested in your yacht",
    "icon": "🚢",
    "badge": "🚢"
  }'
```

#### `POST /broadcast-notification`
Send a notification to all subscribed users
```bash
curl -X POST http://localhost:5000/broadcast-notification \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Important Update",
    "body": "System maintenance in 1 hour",
    "icon": "🚢"
  }'
```

#### `POST /notify-new-lead`
Send a specialized new lead notification
```bash
curl -X POST http://localhost:5000/notify-new-lead \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user@example.com",
    "clientName": "John Smith",
    "yachtName": "Luxury Catamaran 45ft",
    "priority": "high"
  }'
```

#### `POST /test-notification`
Send a test notification to verify setup
```bash
curl -X POST http://localhost:5000/test-notification \
  -H "Content-Type: application/json" \
  -d '{"userId": "user@example.com"}'
```

### Statistics & Monitoring

#### `GET /stats`
Get subscription statistics
```bash
curl http://localhost:5000/stats
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
VAPID_PUBLIC_KEY=your_public_key_here
VAPID_PRIVATE_KEY=your_private_key_here
```

## Generating VAPID Keys

VAPID (Voluntary Application Server Identification) keys are required for Web Push:

```bash
npx web-push generate-vapid-keys
```

This will output:
```
Public Key: BOok22z0xn_0omE8yJUTXiLXnFb89_ZBTIz3X36J7IpNvKSrqD7JdlXfkm5kuvfkaU-dXmZOdkbRrVOpybl-0lc
Private Key: TOFGg5hrMh0aRKg_8FCF-C8glbSeh-PjN9WLkcVstEE
```

Add both keys to your `.env` file. **Keep the private key secure!**

## Frontend Integration

The frontend connects to this backend using the following environment variable:

```bash
REACT_APP_BACKEND_URL=http://localhost:5000  # Local development
REACT_APP_BACKEND_URL=https://api.yachtsummary.com  # Production
```

## Deployment

### Deploy to Heroku

```bash
# Create Heroku app
heroku create yacht-summary-backend

# Set environment variables
heroku config:set VAPID_PUBLIC_KEY=your_key
heroku config:set VAPID_PRIVATE_KEY=your_key

# Deploy
git push heroku main
```

### Deploy to Railway.app

```bash
# Link project
railway init

# Deploy
railway up
```

### Deploy to Vercel (Serverless)

Not recommended for this backend (needs persistent connections). Use traditional hosting like Heroku, Railway, or DigitalOcean.

### Deploy to AWS Lambda

See `deployment/lambda-handler.js` for AWS Lambda wrapper.

## How It Works

### Push Notification Flow

1. **User Subscribes**
   - Frontend requests VAPID public key from backend
   - Browser uses key to subscribe to push manager
   - Browser generates subscription object
   - Frontend sends subscription to backend for storage

2. **New Lead Arrives**
   - Admin/system sends new lead notification via `/notify-new-lead` endpoint
   - Backend retrieves stored subscription
   - Backend sends notification through browser's push service
   - Browser receives notification and displays it to user

3. **Notification Delivery**
   - **Android**: Full support via FCM (Firebase Cloud Messaging)
   - **iOS**: Full support via APNs (Apple Push Notification service)
   - **Desktop**: Full support via browser push service

## Troubleshooting

### "No subscription found for user"
- Ensure user has enabled notifications in the app
- Check that backend and frontend are on same domain (or CORS is enabled)
- Verify VAPID keys are correct

### "Failed to send notification"
- Check that subscription endpoint is still valid
- Verify internet connection
- Check browser console for error details

### CORS Issues
- Verify CORS is enabled in `server.js`
- Add frontend URL to CORS allowed origins

## Production Checklist

- [ ] Generate new VAPID keys
- [ ] Set environment variables in production
- [ ] Enable HTTPS (required for Web Push)
- [ ] Use a real database instead of in-memory storage
- [ ] Add authentication/authorization
- [ ] Set up monitoring and logging
- [ ] Configure backups
- [ ] Test notifications on iOS and Android

## Database Integration (Optional)

For production, replace in-memory `subscriptions` Map with a real database:

```javascript
// Replace: const subscriptions = new Map()
// With: Use MongoDB, PostgreSQL, etc.
```

## Support

For issues or questions, please check the main YachtSummary repository or contact support.

## License

ISC
