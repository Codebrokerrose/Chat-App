const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken');
const UserModel = require('../models/UserModel');
const { ConversationModel, MessageModel } = require('../models/ConversationModel');
const getConversation = require('../helpers/getConversation');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

const onlineUsers = new Map(); // key: userId, value: socket.id

io.on('connection', async (socket) => {
  try {
    const token = socket.handshake.auth.token;
    const user = await getUserDetailsFromToken(token);

    if (!user?._id) {
      console.log('❌ Invalid token - disconnecting socket:', socket.id);
      return socket.disconnect(true);
    }

    const userId = user._id.toString();
    console.log(`✅ User connected: ${userId}, socket: ${socket.id}`);

    onlineUsers.set(userId, socket.id);
    socket.join(userId);
    io.emit('onlineUser', Array.from(onlineUsers.keys()));

    // Send sidebar conversation on connect
    const conversation = await getConversation(userId);
    socket.emit('conversation', conversation);

    // Message page
    socket.on('message-page', async (otherUserId) => {
      const userDetails = await UserModel.findById(otherUserId).select('-password');
      if (!userDetails) return;

      const payload = {
        _id: userDetails._id,
        name: userDetails.name,
        email: userDetails.email,
        profile_pic: userDetails.profile_pic,
        online: onlineUsers.has(otherUserId),
      };
      socket.emit('message-user', payload);

      const conversationData = await ConversationModel.findOne({
        $or: [
          { sender: userId, receiver: otherUserId },
          { sender: otherUserId, receiver: userId },
        ],
      }).populate('messages').sort({ updatedAt: -1 });

      socket.emit('message', conversationData?.messages || []);
    });

    // New message
    socket.on('new message', async (data) => {
      let conversation = await ConversationModel.findOne({
        $or: [
          { sender: data.sender, receiver: data.receiver },
          { sender: data.receiver, receiver: data.sender },
        ],
      });

      if (!conversation) {
        conversation = await new ConversationModel({
          sender: data.sender,
          receiver: data.receiver,
        }).save();
      }

      const message = new MessageModel({
        text: data.text,
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        msgByUserId: data.msgByUserId,
      });

      const savedMessage = await message.save();

      await ConversationModel.findByIdAndUpdate(conversation._id, {
        $push: { messages: savedMessage._id },
      });

      const updatedConversation = await ConversationModel.findById(conversation._id)
        .populate('messages')
        .sort({ updatedAt: -1 });

      // Send messages and conversation updates
      [data.sender, data.receiver].forEach(async (uid) => {
        io.to(uid).emit('message', updatedConversation?.messages || []);
        const conv = await getConversation(uid);
        io.to(uid).emit('conversation', conv);
      });
    });

    // Sidebar refresh
    socket.on('sidebar', async (currentUserId) => {
      const conversations = await getConversation(currentUserId);
      socket.emit('conversation', conversations);
    });

    // Message seen
    socket.on('seen', async (msgByUserId) => {
      const convo = await ConversationModel.findOne({
        $or: [
          { sender: userId, receiver: msgByUserId },
          { sender: msgByUserId, receiver: userId },
        ],
      });

      if (!convo) return;

      const messageIds = convo.messages || [];
      await MessageModel.updateMany(
        { _id: { $in: messageIds }, msgByUserId },
        { $set: { seen: true } }
      );

      const updateForSender = await getConversation(userId);
      const updateForReceiver = await getConversation(msgByUserId);

      io.to(userId).emit('conversation', updateForSender);
      io.to(msgByUserId).emit('conversation', updateForReceiver);
    });

    // Manual Logout — Trigger this from client with socket.emit('manual-logout')
    socket.on('manual-logout', () => {
      onlineUsers.delete(userId);
      socket.leave(userId);
      io.emit('onlineUser', Array.from(onlineUsers.keys()));
      socket.disconnect(true);
      console.log(`👋 Manual logout: ${userId}`);
    });

    // Prevent unintentional disconnects
    socket.on('disconnecting', (reason) => {
      console.log(`⚠️ Disconnecting socket ${socket.id} — Reason: ${reason}`);
    });

    socket.on('disconnect', () => {
      // Only remove user if they didn't manually logout
      if (onlineUsers.get(userId) === socket.id) {
        onlineUsers.delete(userId);
        io.emit('onlineUser', Array.from(onlineUsers.keys()));
        console.log(`❌ User disconnected: ${userId}`);
      }
    });
  } catch (err) {
    console.error('🔥 Error in socket connection:', err.message);
    socket.disconnect(true);
  }
});

module.exports = {
  app,
  server,
};
