const { sessions } = require("../controller/anonSession");

function anonSocketHandler(io, socket) {
  // Handle anonymous chat join
  socket.on("anon-join", ({ sessionId, name }) => {
    // Check if session exists
    if (!sessions[sessionId]) {
      socket.emit("anon-expired"); // Notify client of session expiration
      return;
    }

    socket.join(sessionId);

    // Add user to session if not already present
    const userExists = sessions[sessionId].users.find((u) => u.name === name);
    if (!userExists) {
      sessions[sessionId].users.push({ name });
    }

    // Send existing chat history
    socket.emit("anon-history", sessions[sessionId].messages);
  });

  // Handle anonymous chat message
  socket.on("anon-message", ({ sessionId, name, text }) => {
    if (!sessions[sessionId]) {
      socket.emit("anon-expired"); // Optional: emit again if needed on message send
      return;
    }

    const msg = { name, text };
    sessions[sessionId].messages.push(msg);
    io.to(sessionId).emit("anon-message", msg);
  });
}

module.exports = anonSocketHandler;
