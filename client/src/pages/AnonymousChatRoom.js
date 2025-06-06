import React, { useEffect, useState, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import io from "socket.io-client";

// Anonymous name list
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

// Generate a random name (exclude optional)
function getRandomName(excludeName = "") {
  let name;
  do {
    name =
      fruitsAndVeggies[Math.floor(Math.random() * fruitsAndVeggies.length)];
  } while (name === excludeName);
  return name;
}

const AnonymousChatRoom = () => {
  const { sessionId } = useParams();
  const location = useLocation();

  const savedNameKey = `anon-name-${sessionId}`;

  const [username, setUsername] = useState(() => {
    const storedName = sessionStorage.getItem(savedNameKey);
    if (storedName) return storedName;

    const incomingName = location.state?.name;
    const randomName = incomingName || getRandomName();
    sessionStorage.setItem(savedNameKey, randomName);
    return randomName;
  });

  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const s = io(process.env.REACT_APP_BACKEND_URL, {
      query: { sessionId, name: username, anonymous: true },
    });
    setSocket(s);

    s.emit("anon-join", { sessionId, name: username });

    s.on("anon-message", (msg) => setMessages((prev) => [...prev, msg]));
    s.on("anon-history", (history) => setMessages(history));

    return () => {
      s.off("anon-message");
      s.off("anon-history");
      s.disconnect();
    };
  }, [sessionId, username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    socket.emit("anon-message", { sessionId, name: username, text: input });
    setInput("");
  };

  const backgroundImage = require("../assets/images/photo.jpg");

  return (
    <div
      className="d-flex flex-column"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
      }}
    >
      <header
        className="sticky-top bg-white"
        style={{ height: "4rem", zIndex: 1 }}
      >
        <div className="d-flex align-items-center gap-3 h-100 px-3">
          <h3 className="mb-0 fw-bold text-primary">Anonymous Chat Room</h3>
          <div className="ms-auto text-secondary small">
            You are: <b>{username}</b>
          </div>
        </div>
      </header>

      <section
        style={{
          height: "calc(100vh - 128px)",
          overflowX: "hidden",
          overflowY: "auto",
          backgroundColor: "rgba(255,255,255,0.5)",
        }}
      >
        <div>
          {messages.map((msg, idx) => {
            const isOwnMessage = msg.name === username;
            return (
              <div
                key={idx}
                className={`d-flex m-3 ${
                  isOwnMessage ? "justify-content-end" : "justify-content-start"
                }`}
              >
                <div
                  className={`p-2 rounded shadow-sm text-dark`}
                  style={{
                    maxWidth: "75%",
                    backgroundColor: isOwnMessage ? "#ccfbf1" : "#fff",
                    opacity: 1,
                  }}
                >
                  <div
                    className="mb-1 fw-bold small"
                    style={{ color: isOwnMessage ? "#0d6efd" : "#22c55e" }}
                  >
                    {msg.name}
                  </div>
                  <div>{msg.text}</div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </section>

      <form
        className="d-flex p-3 bg-white"
        style={{ borderTop: "1px solid #eee" }}
        onSubmit={sendMessage}
      >
        <input
          className="form-control me-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          autoFocus
        />
        <button className="btn btn-primary" type="submit">
          Send
        </button>
      </form>
    </div>
  );
};

export default AnonymousChatRoom;
