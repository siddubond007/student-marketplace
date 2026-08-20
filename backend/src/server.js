const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const prisma = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const gigRoutes = require('./routes/gigRoutes');
const jobRoutes = require('./routes/jobRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { moderateMessage } = require('./services/moderationService');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json());

// REST Routes
app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Marketplace API running smoothly.' });
});

// Socket.io Realtime Chat & AI Filtering
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
