const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const webpush = require('web-push');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static('public'));

// Store subscriptions in memory (in production, use a database)
const subscriptions = new Map();

// Web Push Configuration
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY || 'BEo_8J7F9v3d6t9K8m2P4q5L7n8R9sT0v1W2x3Y4z5A6b7C8d9E0f1G2h3I4j5K6l7M8';
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || 'YOUR_PRIVATE_KEY_HERE';

// Set VAPID details
if (vapidPrivateKey !== 'YOUR_PRIVATE_KEY_HERE') {
  webpush.setVapidDetails(
    'mailto:admin@yachtsummary.com',
    vapidPublicKey,
    vapidPrivateKey
  );
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running!', timestamp: new Date().toISOString() });
});

// Get VAPID public key
app.get('/vapid-public-key', (req, res) => {
  res.json({ vapidPublicKey });
});

// Subscribe to push notifications
app.post('/subscribe', (req, res) => {
  const { subscription, userId } = req.body;

  if (!subscription) {
    return res.status(400).json({ error: 'Subscription is required' });
  }

  // Store subscription with userId
  subscriptions.set(userId || 'anonymous', subscription);
  console.log(`✓ Subscription saved for user: ${userId || 'anonymous'}`);

  res.json({ success: true, message: 'Subscribed to push notifications' });
});

// Unsubscribe from push notifications
app.post('/unsubscribe', (req, res) => {
  const { userId } = req.body;

  if (subscriptions.has(userId)) {
    subscriptions.delete(userId);
    console.log(`✓ Unsubscribed user: ${userId}`);
  }

  res.json({ success: true, message: 'Unsubscribed from push notifications' });
});

// Send notification to a specific user
app.post('/send-notification', async (req, res) => {
  const { userId, title, body, icon, badge, tag } = req.body;

  if (!userId || !title || !body) {
    return res.status(400).json({ error: 'userId, title, and body are required' });
  }

  const subscription = subscriptions.get(userId);

  if (!subscription) {
    return res.status(404).json({ error: `No subscription found for user: ${userId}` });
  }

  const payload = JSON.stringify({
    title: title || '🚢 YachtSummary',
    body: body,
    icon: icon || '🚢',
    badge: badge || '🚢',
    tag: tag || 'notification',
    data: {
      url: 'https://yachtsummary.com'
    }
  });

  try {
    await webpush.sendNotification(subscription, payload);
    console.log(`✓ Notification sent to ${userId}`);
    res.json({ success: true, message: 'Notification sent successfully' });
  } catch (error) {
    console.error(`✗ Failed to send notification: ${error.message}`);
    
    // Remove invalid subscription
    if (error.statusCode === 410) {
      subscriptions.delete(userId);
    }
    
    res.status(500).json({ error: 'Failed to send notification', details: error.message });
  }
});

// Send notification to all users
app.post('/broadcast-notification', async (req, res) => {
  const { title, body, icon, badge, tag } = req.body;

  if (!title || !body) {
    return res.status(400).json({ error: 'title and body are required' });
  }

  const payload = JSON.stringify({
    title: title || '🚢 YachtSummary',
    body: body,
    icon: icon || '🚢',
    badge: badge || '🚢',
    tag: tag || 'notification',
    data: {
      url: 'https://yachtsummary.com'
    }
  });

  let successCount = 0;
  let failureCount = 0;

  for (const [userId, subscription] of subscriptions.entries()) {
    try {
      await webpush.sendNotification(subscription, payload);
      successCount++;
      console.log(`✓ Notification sent to ${userId}`);
    } catch (error) {
      failureCount++;
      console.error(`✗ Failed to send to ${userId}: ${error.message}`);
      
      // Remove invalid subscription
      if (error.statusCode === 410) {
        subscriptions.delete(userId);
      }
    }
  }

  res.json({
    success: true,
    message: `Broadcast sent to ${successCount} users, ${failureCount} failed`,
    successCount,
    failureCount
  });
});

// Get statistics
app.get('/stats', (req, res) => {
  res.json({
    totalSubscriptions: subscriptions.size,
    subscriptions: Array.from(subscriptions.keys())
  });
});

// Test notification endpoint
app.post('/test-notification', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  const subscription = subscriptions.get(userId);

  if (!subscription) {
    return res.status(404).json({ error: `No subscription found for user: ${userId}` });
  }

  const payload = JSON.stringify({
    title: '✓ Test Notification',
    body: 'Push notifications are working perfectly!',
    icon: '🚢',
    badge: '🚢',
    tag: 'test-notification'
  });

  try {
    await webpush.sendNotification(subscription, payload);
    console.log(`✓ Test notification sent to ${userId}`);
    res.json({ success: true, message: 'Test notification sent!' });
  } catch (error) {
    console.error(`✗ Failed to send test notification: ${error.message}`);
    
    if (error.statusCode === 410) {
      subscriptions.delete(userId);
    }
    
    res.status(500).json({ error: 'Failed to send test notification', details: error.message });
  }
});

// Universal notification endpoint - handles any notification type
app.post('/notify', async (req, res) => {
  const { 
    userId,           // Target user ID (optional for broadcast)
    title,            // Notification title
    body,             // Notification message
    icon = '🚢',      // Icon (default: 🚢)
    badge = '🚢',    // Badge (default: 🚢)
    tag = 'notification', // Tag for grouping
    url = 'https://yachtsummary.com', // Click URL
    type = 'general', // Notification type
    priority = 'normal', // Priority level
    data = {},       // Additional data
    broadcast = false // Send to all users
  } = req.body;

  // Validation
  if (!title || !body) {
    return res.status(400).json({ error: 'title and body are required' });
  }

  if (!broadcast && !userId) {
    return res.status(400).json({ error: 'userId is required for individual notifications, or set broadcast: true' });
  }

  // Priority emoji mapping
  const priorityEmojis = {
    'low': '🟢',
    'normal': '🔵', 
    'medium': '🟡',
    'high': '🔴',
    'urgent': '🚨'
  };

  const priorityEmoji = priorityEmojis[priority] || '🔵';

  // Build notification payload
  const payload = JSON.stringify({
    title: `${priorityEmoji} ${title}`,
    body: body,
    icon: icon,
    badge: badge,
    tag: tag,
    data: {
      url: url,
      type: type,
      priority: priority,
      timestamp: new Date().toISOString(),
      ...data
    }
  });

  let successCount = 0;
  let failureCount = 0;
  const results = [];

  if (broadcast) {
    // Send to all users
    for (const [targetUserId, subscription] of subscriptions.entries()) {
      try {
        await webpush.sendNotification(subscription, payload);
        successCount++;
        results.push({ userId: targetUserId, status: 'success' });
        console.log(`✓ Broadcast notification sent to ${targetUserId}`);
      } catch (error) {
        failureCount++;
        results.push({ userId: targetUserId, status: 'failed', error: error.message });
        console.error(`✗ Failed to send to ${targetUserId}: ${error.message}`);
        
        // Remove invalid subscription
        if (error.statusCode === 410) {
          subscriptions.delete(targetUserId);
        }
      }
    }

    res.json({
      success: true,
      message: `Broadcast sent to ${successCount} users, ${failureCount} failed`,
      type: 'broadcast',
      successCount,
      failureCount,
      results
    });

  } else {
    // Send to specific user
    const subscription = subscriptions.get(userId);

    if (!subscription) {
      return res.status(404).json({ error: `No subscription found for user: ${userId}` });
    }

    try {
      await webpush.sendNotification(subscription, payload);
      console.log(`✓ Notification sent to ${userId}`);
      res.json({ 
        success: true, 
        message: 'Notification sent successfully',
        type: 'individual',
        userId: userId
      });
    } catch (error) {
      console.error(`✗ Failed to send notification: ${error.message}`);
      
      // Remove invalid subscription
      if (error.statusCode === 410) {
        subscriptions.delete(userId);
      }
      
      res.status(500).json({ error: 'Failed to send notification', details: error.message });
    }
  }
});

// New lead notification (main use case)
app.post('/notify-new-lead', async (req, res) => {
  const { userId, clientName, yachtName, priority } = req.body;

  if (!userId || !clientName || !yachtName) {
    return res.status(400).json({ error: 'userId, clientName, and yachtName are required' });
  }

  const priorityEmoji = priority === 'high' ? '🔴' : priority === 'medium' ? '🟡' : '🟢';

  const subscription = subscriptions.get(userId);

  if (!subscription) {
    return res.status(404).json({ error: `No subscription found for user: ${userId}` });
  }

  const payload = JSON.stringify({
    title: `${priorityEmoji} New Lead: ${clientName}`,
    body: `Interested in: ${yachtName}`,
    icon: '🚢',
    badge: '🚢',
    tag: 'new-lead',
    data: {
      url: 'https://yachtsummary.com',
      type: 'new_lead',
      clientName,
      yachtName,
      priority
    }
  });

  try {
    await webpush.sendNotification(subscription, payload);
    console.log(`✓ New lead notification sent to ${userId}`);
    res.json({ success: true, message: 'Lead notification sent!' });
  } catch (error) {
    console.error(`✗ Failed to send lead notification: ${error.message}`);
    
    if (error.statusCode === 410) {
      subscriptions.delete(userId);
    }
    
    res.status(500).json({ error: 'Failed to send lead notification', details: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`\n🚢 YachtSummary Backend Server running on port ${PORT}`);
  console.log(`\n📋 Available endpoints:`);
  console.log(`   GET  /health                    - Server health check`);
  console.log(`   GET  /vapid-public-key          - Get VAPID public key`);
  console.log(`   POST /subscribe                 - Subscribe to notifications`);
  console.log(`   POST /unsubscribe               - Unsubscribe from notifications`);
  console.log(`   POST /notify                    - Universal notification endpoint (NEW!)`);
  console.log(`   POST /send-notification         - Send notification to specific user`);
  console.log(`   POST /broadcast-notification    - Send notification to all users`);
  console.log(`   POST /notify-new-lead           - Send new lead notification`);
  console.log(`   POST /test-notification         - Send test notification`);
  console.log(`   GET  /stats                     - Get subscription statistics\n`);
});
