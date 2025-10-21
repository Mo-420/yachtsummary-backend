# 🚢 YachtSummary Notification System Guide

## 📋 Overview

The YachtSummary notification system allows you to send push notifications to users of the YachtSummary PWA from yachtsummary.com. The system is built with Node.js, Express, and Web Push API.

**Live Backend:** https://yachtsummary-backend.onrender.com  
**Dashboard:** https://yachtsummary-backend.onrender.com (Web Interface)

---

## 🏗️ How It Works

### 1. **User Subscription Flow**
```
User visits PWA → Requests notification permission → Gets VAPID key → Subscribes to push service
```

### 2. **Notification Sending Flow**
```
yachtsummary.com → API call to backend → Backend sends push notification → User receives notification
```

### 3. **Architecture**
- **Frontend (PWA):** React app with service worker for push notifications
- **Backend:** Node.js server with Web Push API
- **Storage:** In-memory subscription storage (production should use database)
- **Push Service:** Browser's push service (Chrome, Firefox, Safari)

---

## 🚀 API Endpoints

### **Health Check**
```http
GET /health
```
**Response:**
```json
{
  "status": "Backend is running!",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### **Get VAPID Public Key**
```http
GET /vapid-public-key
```
**Response:**
```json
{
  "vapidPublicKey": "BEo_8J7F9v3d6t9K8m2P4q5L7n8R9sT0v1W2x3Y4z5A6b7C8d9E0f1G2h3I4j5K6l7M8"
}
```

### **Subscribe User**
```http
POST /subscribe
Content-Type: application/json

{
  "subscription": {
    "endpoint": "https://fcm.googleapis.com/fcm/send/...",
    "keys": {
      "p256dh": "...",
      "auth": "..."
    }
  },
  "userId": "user123"
}
```

### **Universal Notification Endpoint (NEW!)**
```http
POST /notify
Content-Type: application/json

{
  "userId": "user123",           // Optional for broadcast
  "title": "New Yacht Available!",
  "body": "Check out this amazing yacht!",
  "icon": "🚢",                   // Default: 🚢
  "badge": "🚢",                 // Default: 🚢
  "tag": "yacht-notification",   // Default: notification
  "url": "https://yachtsummary.com", // Default: https://yachtsummary.com
  "type": "yacht_alert",         // Default: general
  "priority": "high",            // low, normal, medium, high, urgent
  "data": {                      // Additional custom data
    "yachtId": "123",
    "price": "$500,000"
  },
  "broadcast": false             // Send to all users
}
```

### **Send Notification to Specific User**
```http
POST /send-notification
Content-Type: application/json

{
  "userId": "user123",
  "title": "New Yacht Available!",
  "body": "Check out this amazing yacht!",
  "icon": "🚢",
  "badge": "🚢",
  "tag": "yacht-notification"
}
```

### **Broadcast to All Users**
```http
POST /broadcast-notification
Content-Type: application/json

{
  "title": "Yacht Show Update",
  "body": "New yachts added to our collection!",
  "icon": "🚢",
  "badge": "🚢",
  "tag": "broadcast"
}
```

### **Send New Lead Notification**
```http
POST /notify-new-lead
Content-Type: application/json

{
  "userId": "broker123",
  "clientName": "John Smith",
  "yachtName": "Ocean Dream 50ft",
  "priority": "high"
}
```

### **Test Notification**
```http
POST /test-notification
Content-Type: application/json

{
  "userId": "user123"
}
```

### **Get Statistics**
```http
GET /stats
```
**Response:**
```json
{
  "totalSubscriptions": 5,
  "subscriptions": ["user123", "broker456", "admin789"]
}
```

---

## 💻 How to Send Notifications

### **Method 1: Web Dashboard (Easiest)**

1. **Visit:** https://yachtsummary-backend.onrender.com
2. **Choose notification type:**
   - **Send Notification:** Target specific user
   - **Broadcast:** Send to all users
   - **New Lead:** Send lead notification
3. **Fill in the form** and click send
4. **View results** in the response area

### **Method 2: API Calls from yachtsummary.com**

#### **JavaScript Example:**
```javascript
// Universal notification function (RECOMMENDED)
async function sendUniversalNotification(options) {
  try {
    const response = await fetch('https://yachtsummary-backend.onrender.com/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: options.userId,           // Optional for broadcast
        title: options.title,
        body: options.body,
        icon: options.icon || '🚢',
        badge: options.badge || '🚢',
        tag: options.tag || 'notification',
        url: options.url || 'https://yachtsummary.com',
        type: options.type || 'general',
        priority: options.priority || 'normal',
        data: options.data || {},
        broadcast: options.broadcast || false
      })
    });
    
    const result = await response.json();
    console.log('Notification sent:', result);
    return result;
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

// Send notification to specific user
async function sendNotification(userId, title, body) {
  try {
    const response = await fetch('https://yachtsummary-backend.onrender.com/send-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        title: title,
        body: body,
        icon: '🚢',
        badge: '🚢'
      })
    });
    
    const result = await response.json();
    console.log('Notification sent:', result);
    return result;
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

// Broadcast to all users
async function broadcastNotification(title, body) {
  try {
    const response = await fetch('https://yachtsummary-backend.onrender.com/broadcast-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        body: body,
        icon: '🚢'
      })
    });
    
    const result = await response.json();
    console.log('Broadcast sent:', result);
    return result;
  } catch (error) {
    console.error('Error broadcasting:', error);
  }
}

// Send new lead notification
async function sendLeadNotification(userId, clientName, yachtName, priority = 'medium') {
  try {
    const response = await fetch('https://yachtsummary-backend.onrender.com/notify-new-lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        clientName: clientName,
        yachtName: yachtName,
        priority: priority
      })
    });
    
    const result = await response.json();
    console.log('Lead notification sent:', result);
    return result;
  } catch (error) {
    console.error('Error sending lead notification:', error);
  }
}
```

#### **cURL Examples:**
```bash
# Universal notification (RECOMMENDED)
curl -X POST https://yachtsummary-backend.onrender.com/notify \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "title": "New Yacht Available!",
    "body": "Check out this amazing yacht!",
    "icon": "🚢",
    "priority": "high",
    "type": "yacht_alert",
    "data": {"yachtId": "123", "price": "$500,000"}
  }'

# Universal broadcast to all users
curl -X POST https://yachtsummary-backend.onrender.com/notify \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Yacht Show Update",
    "body": "New yachts added to our collection!",
    "broadcast": true,
    "priority": "medium"
  }'

# Send notification to specific user
curl -X POST https://yachtsummary-backend.onrender.com/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "title": "New Yacht Available!",
    "body": "Check out this amazing yacht!",
    "icon": "🚢"
  }'

# Broadcast to all users
curl -X POST https://yachtsummary-backend.onrender.com/broadcast-notification \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Yacht Show Update",
    "body": "New yachts added to our collection!",
    "icon": "🚢"
  }'

# Send new lead notification
curl -X POST https://yachtsummary-backend.onrender.com/notify-new-lead \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "broker123",
    "clientName": "John Smith",
    "yachtName": "Ocean Dream 50ft",
    "priority": "high"
  }'
```

---

## 🔧 Integration with yachtsummary.com

### **1. Update PWA Configuration**

In your PWA, update the backend URL:

```javascript
// In your PWA's notification service
const BACKEND_URL = 'https://yachtsummary-backend.onrender.com';

// Subscribe to notifications
async function subscribeToNotifications() {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY' // Get from /vapid-public-key endpoint
  });
  
  // Send subscription to backend
  await fetch(`${BACKEND_URL}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      subscription: subscription,
      userId: getCurrentUserId()
    })
  });
}
```

### **2. Send Notifications from Website**

Add notification buttons to your website:

```html
<!-- Example: Send notification when new yacht is added -->
<button onclick="notifyNewYacht()">Notify Users About New Yacht</button>

<script>
async function notifyNewYacht() {
  const response = await fetch('https://yachtsummary-backend.onrender.com/broadcast-notification', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'New Yacht Added!',
      body: 'Check out our latest addition to the fleet!',
      icon: '🚢'
    })
  });
  
  const result = await response.json();
  alert(`Notification sent: ${result.message}`);
}
</script>
```

---

## 📱 Notification Types

### **1. Individual Notifications**
- **Use case:** Target specific users
- **Example:** "John, your yacht inquiry has been updated"
- **Endpoint:** `/send-notification`

### **2. Broadcast Notifications**
- **Use case:** Announcements to all users
- **Example:** "New yacht show dates announced!"
- **Endpoint:** `/broadcast-notification`

### **3. Lead Notifications**
- **Use case:** New sales leads for brokers
- **Example:** "🔴 New Lead: John Smith interested in Ocean Dream 50ft"
- **Endpoint:** `/notify-new-lead`
- **Priority levels:** low (🟢), medium (🟡), high (🔴)

### **4. Test Notifications**
- **Use case:** Verify system is working
- **Example:** "✓ Test Notification - Push notifications are working!"
- **Endpoint:** `/test-notification`

---

## 🛠️ Troubleshooting

### **Common Issues:**

1. **"No subscription found for user"**
   - User hasn't subscribed to notifications
   - User ID doesn't match
   - Subscription expired

2. **"Failed to send notification"**
   - Invalid subscription (user unsubscribed)
   - Network issues
   - VAPID keys incorrect

3. **Notifications not appearing**
   - Check browser notification permissions
   - Verify service worker is registered
   - Check browser console for errors

### **Debug Steps:**

1. **Check server health:** `GET /health`
2. **View subscriptions:** `GET /stats`
3. **Test notification:** `POST /test-notification`
4. **Check browser console** for errors
5. **Verify VAPID keys** are correct

---

## 🔐 Security Notes

- **VAPID Keys:** Keep private key secure, never expose in frontend
- **User IDs:** Use consistent, unique identifiers
- **Rate Limiting:** Consider implementing rate limits for production
- **HTTPS:** Required for push notifications (already handled by Render)

---

## 📊 Monitoring

### **Check System Status:**
```bash
# Health check
curl https://yachtsummary-backend.onrender.com/health

# View statistics
curl https://yachtsummary-backend.onrender.com/stats
```

### **Dashboard Features:**
- Real-time subscription count
- User list
- Send test notifications
- View API responses

---

## 🚀 Production Considerations

### **Database Storage:**
Replace in-memory storage with database:
```javascript
// Example with MongoDB
const mongoose = require('mongoose');
const subscriptionSchema = new mongoose.Schema({
  userId: String,
  subscription: Object,
  createdAt: Date
});
```

### **Environment Variables:**
```bash
VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
VAPID_EMAIL=admin@yachtsummary.com
```

### **Scaling:**
- Use Redis for subscription storage
- Implement rate limiting
- Add monitoring and logging
- Consider multiple server instances

---

## 📞 Support

**Backend URL:** https://yachtsummary-backend.onrender.com  
**Dashboard:** https://yachtsummary-backend.onrender.com  
**GitHub:** https://github.com/Mo-420/yachtsummary-backend

**Questions?** Check the dashboard for real-time status and test notifications!
