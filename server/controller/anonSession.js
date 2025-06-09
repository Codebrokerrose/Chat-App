const { v4: uuidv4 } = require("uuid");
let io = null; // 👈 Global variable to hold Socket.IO reference
const sessions = {};
const SESSION_DURATION_MS = 60 * 60 * 1000; // 3600000 ms ...

const fruitsAndVeggies = [
  "Apple",
  "Banana",
  "Carrot",
  "Tomato",
  "Mango",
  "Peach",
  "Potato",
  "Broccoli",
  "Cucumber",
  "Grape",
  "Onion",
  "Pumpkin",
  "Kiwi",
  "Radish",
  "Spinach",
  "Pear",
  "Cherry",
  "Lettuce",
  "Melon",
  "Orange",
];
function getRandomName() {
  return fruitsAndVeggies[Math.floor(Math.random() * fruitsAndVeggies.length)];
}

exports.setSocketIO = (socketIO) => {
  io = socketIO;
};

exports.createSession = (req, res) => {
  const { name } = req.body;
  const sessionId = uuidv4();
  sessions[sessionId] = {
    users: [{ name }],
    messages: [],
    createdAt: new Date(),
  };
  console.log(
    `⏱️ Session ${sessionId} created at ${new Date().toLocaleTimeString()}`
  );
  setTimeout(() => {
    console.log(
      `💣 Expiring session ${sessionId} at ${new Date().toLocaleTimeString()}`
    );
    if (sessions[sessionId]) {
      if (io) {
        io.to(sessionId).emit("anon-expired"); // ✅ emit only if io exists
      }
      delete sessions[sessionId];
      console.log(`Session ${sessionId} expired`);
    }
  }, SESSION_DURATION_MS);

  res.json({ sessionId });
};

exports.joinSession = (req, res) => {
  const { sessionId } = req.body;
  if (!sessions[sessionId])
    return res.status(404).json({ error: "Session not found" });

  const name = getRandomName();
  sessions[sessionId].users.push({ name });
  res.json({ name });
};

exports.sessions = sessions;
