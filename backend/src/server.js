const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const prisma = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const gigRoutes = require('./routes/gigRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const jobRoutes = require('./routes/jobRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const resumableUploadRoutes = require('./routes/resumableUploadRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const payoutRoutes = require('./routes/payoutRoutes');
const disputeRoutes = require('./routes/disputeRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const { moderateMessage } = require('./services/moderationService');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(cors());

// TEMP REQUEST DEBUG LOGGER
app.use((req, res, next) => {
  console.log('📥 REQUEST:', req.method, req.originalUrl);
  console.log('🔐 AUTH:', req.headers.authorization ? 'Bearer token present' : 'NO AUTH TOKEN');
  next();
});
// 🛡️ CRITICAL: Webhooks must use raw buffer to mathematically verify Razorpay signatures
app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhookRoutes);

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// REST Routes
app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/upload/resumable', resumableUploadRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payouts', payoutRoutes);
app.use('/api/disputes', disputeRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Marketplace API running smoothly.' });
});

// Socket.io Realtime Chat
io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) socket.join(`user_${userId}`);

  socket.on('join_order_room', (orderId) => {
    socket.join(`order_${orderId}`);
  });

  socket.on('send_chat_message', async (data) => {
    const { orderId, senderId, recipientId, content, fileUrl } = data;
    const check = await moderateMessage(content);

    if (!check.isAllowed) {
      await prisma.moderationLog.create({
        data: { senderId, flaggedText: content, violationType: check.reason, confidence: 0.95 }
      });
      return socket.emit('message_blocked', { warning: check.warning, blockedText: content });
    }

    const message = await prisma.message.create({
      data: { orderId, senderId, recipientId, content, fileUrl }
    });

    io.to(`order_${orderId}`).emit('new_message', message);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
});
