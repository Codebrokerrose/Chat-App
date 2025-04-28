const { v4: uuidv4 } = require('uuid');
const sessions = {};
const fruitsAndVeggies = [
  "Apple", "Banana", "Carrot", "Tomato", "Mango", "Peach", "Potato", "Broccoli", "Cucumber", "Grape", "Onion", "Pumpkin", "Kiwi", "Radish", "Spinach", "Pear", "Cherry", "Lettuce", "Melon", "Orange"
];

function getRandomName() {
  return fruitsAndVeggies[Math.floor(Math.random() * fruitsAndVeggies.length)];
}

exports.createSession = (req, res) => {
  const { name } = req.body;
  const sessionId = uuidv4();
  sessions[sessionId] = {
    users: [{ name }],
    messages: [],
    createdAt: new Date()
  };
  res.json({ sessionId });
};

exports.joinSession = (req, res) => {
  const { sessionId } = req.body;
  if (!sessions[sessionId]) return res.status(404).json({ error: 'Session not found' });
  const name = getRandomName();
  sessions[sessionId].users.push({ name });
  res.json({ name });
};

exports.sessions = sessions;
