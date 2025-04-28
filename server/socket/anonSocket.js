const { sessions } = require('../controller/anonSession');

function anonSocketHandler(io, socket) {
  // Handle anonymous chat join
  socket.on('anon-join', ({ sessionId, name }) => {
    socket.join(sessionId);
    // Add user to session if not already present
    if (sessions[sessionId]) {
      if (!sessions[sessionId].users.find(u => u.name === name)) {
        sessions[sessionId].users.push({ name });
      }
      // Send chat history
      socket.emit('anon-history', sessions[sessionId].messages);
    }
  });

  // Handle anonymous chat message
  socket.on('anon-message', ({ sessionId, name, text }) => {
    if (!sessions[sessionId]) return;
    const msg = { name, text };
    sessions[sessionId].messages.push(msg);
    io.to(sessionId).emit('anon-message', msg);
  });
}

module.exports = anonSocketHandler;
