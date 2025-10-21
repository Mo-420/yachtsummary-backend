# 🚢 YachtSummary Notification System - Quick Share

## 📱 **Live Notification System**

**🌐 Dashboard:** https://yachtsummary-backend.onrender.com  
**📚 Full Guide:** https://github.com/Mo-420/yachtsummary-backend/blob/main/NOTIFICATION_GUIDE.md

---

## 🚀 **What This System Does**

✅ **Send push notifications** to yacht brokerage PWA users  
✅ **Global reach** - works worldwide  
✅ **Real-time delivery** - instant notifications  
✅ **Multiple targeting** - individual users or broadcast to all  
✅ **Priority levels** - urgent, high, medium, low  
✅ **Custom data** - attach any information  

---

## 🎯 **Quick Start**

### **1. Web Dashboard (Easiest)**
- Visit: https://yachtsummary-backend.onrender.com
- Choose notification type
- Fill form and send
- View results instantly

### **2. API Integration**
```javascript
// Send notification from yachtsummary.com
fetch('https://yachtsummary-backend.onrender.com/notify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user123',
    title: 'New Yacht Available!',
    body: 'Check out this amazing yacht!',
    priority: 'high'
  })
});
```

---

## 📋 **Available Endpoints**

- `POST /notify` - Universal notification (RECOMMENDED)
- `POST /send-notification` - Send to specific user
- `POST /broadcast-notification` - Send to all users
- `POST /notify-new-lead` - New lead alerts
- `GET /stats` - View subscription count
- `GET /health` - Server status

---

## 🎨 **Notification Types**

### **Individual Notifications**
- Target specific users
- Example: "John, your yacht inquiry updated"

### **Broadcast Notifications**
- Send to all users
- Example: "New yacht show dates announced!"

### **Lead Notifications**
- Sales leads for brokers
- Priority levels: 🔴 High, 🟡 Medium, 🟢 Low

### **Custom Notifications**
- Any title/message
- Custom icons, URLs, data
- Priority levels with emojis

---

## 🔧 **Integration Examples**

### **From Website:**
```html
<button onclick="notifyUsers()">Notify About New Yacht</button>
<script>
async function notifyUsers() {
  await fetch('https://yachtsummary-backend.onrender.com/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'New Yacht Added!',
      body: 'Check out our latest addition!',
      broadcast: true
    })
  });
}
</script>
```

### **From Server:**
```bash
curl -X POST https://yachtsummary-backend.onrender.com/notify \
  -H "Content-Type: application/json" \
  -d '{"title": "Yacht Alert", "body": "New yacht available", "broadcast": true}'
```

---

## 📊 **Current Status**

- ✅ **Backend deployed** on Render
- ✅ **Web dashboard** available
- ✅ **API endpoints** working
- ✅ **Documentation** complete
- ✅ **Ready for production**

---

## 🎯 **Use Cases**

1. **New Yacht Alerts** - Notify when new yachts added
2. **Lead Notifications** - Alert brokers to new inquiries
3. **Show Updates** - Announce yacht show changes
4. **Price Alerts** - Notify of price changes
5. **Custom Messages** - Any notification content

---

## 📞 **Support**

**GitHub:** https://github.com/Mo-420/yachtsummary-backend  
**Dashboard:** https://yachtsummary-backend.onrender.com  
**Full Guide:** See NOTIFICATION_GUIDE.md in repository

---

## 🚀 **Next Steps**

1. **Test the dashboard** - Send a test notification
2. **Integrate with PWA** - Connect your yacht app
3. **Deploy to production** - Go live with notifications
4. **Monitor usage** - Track subscription stats

**Ready to send notifications to yacht users worldwide! 🌍🚢**
