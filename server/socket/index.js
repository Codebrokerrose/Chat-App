// socketServer.js
const express = require('express');
const { Server } = require('socket.io');
const anonSocketHandler = require('./anonSocket');
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
  pingTimeout: 25000,
  pingInterval: 10000,
});

const onlineUsers = new Map();

io.on('connection', async (socket) => {
  const isAnonymous = socket.handshake.query.anonymous === 'true';
  if (isAnonymous) {
    anonSocketHandler(io, socket);
    return;
  }
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      console.warn('Socket connection missing token');
      return socket.disconnect(true);
    }
    const user = await getUserDetailsFromToken(token);
    if (!user?._id) {
      console.warn('Socket connection invalid/expired token');
      return socket.disconnect(true);
    }

    const userId = user._id.toString();
    onlineUsers.set(userId, socket.id);
    socket.join(userId);
    io.emit('onlineUser', Array.from(onlineUsers.keys()));

    const conversation = await getConversation(userId);
    socket.emit('conversation', conversation);

    socket.on('message-page', async (otherUserId) => {
      const userDetails = await UserModel.findById(otherUserId).select('-password');
      if (!userDetails) return;

      socket.emit('message-user', {
        _id: userDetails._id,
        name: userDetails.name,
        email: userDetails.email,
        profile_pic: userDetails.profile_pic,
        online: onlineUsers.has(otherUserId),
      });

      const conversationData = await ConversationModel.findOne({
        $or: [
          { sender: userId, receiver: otherUserId },
          { sender: otherUserId, receiver: userId },
        ],
      }).populate('messages').sort({ updatedAt: -1 });

      socket.emit('message', conversationData?.messages || []);
    });

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

      [data.sender, data.receiver].forEach(async (uid) => {
        io.to(uid).emit('message', updatedConversation?.messages || []);
        const conv = await getConversation(uid);
        io.to(uid).emit('conversation', conv);
      });
    });

    socket.on('sidebar', async (currentUserId) => {
      const conversations = await getConversation(currentUserId);
      socket.emit('conversation', conversations);
    });

    socket.on('seen', async (msgByUserId) => {
      const convo = await ConversationModel.findOne({
        $or: [
          { sender: userId, receiver: msgByUserId },
          { sender: msgByUserId, receiver: userId },
        ],
      });

      if (!convo) return;

      await MessageModel.updateMany(
        { _id: { $in: convo.messages || [] }, msgByUserId },
        { $set: { seen: true } }
      );

      const updateForSender = await getConversation(userId);
      const updateForReceiver = await getConversation(msgByUserId);

      io.to(userId).emit('conversation', updateForSender);
      io.to(msgByUserId).emit('conversation', updateForReceiver);
    });

    socket.on('manual-logout', () => {
      onlineUsers.delete(userId);
      socket.leave(userId);
      io.emit('onlineUser', Array.from(onlineUsers.keys()));
      socket.disconnect(true);
    });

    socket.on('disconnect', () => {
      if (onlineUsers.get(userId) === socket.id) {
        onlineUsers.delete(userId);
        io.emit('onlineUser', Array.from(onlineUsers.keys()));
      }
    });
  } catch (err) {
    console.error('🔥 Socket error:', err.message);
    socket.disconnect(true);
  }
});

module.exports = { app, server };
