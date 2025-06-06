import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

const AnonymousChatEntry = () => {
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [anonName, setAnonName] = useState("");
  const navigate = useNavigate();

  const handleStartAnonymous = async () => {
    setLoading(true);
    const randomName = getRandomName();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/anon-session`,
        { name: randomName }
      );
      const { sessionId } = response.data;
      setAnonName(randomName);
      setInviteLink(`${window.location.origin}/anon-chat/${sessionId}`);
    } catch (err) {
      alert("⚠️ Failed to start anonymous chat. Try again later.");
    }

    setLoading(false);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg,rgb(121, 204, 252), #96e6a1)",
        padding: "20px",
      }}
    >
      <div
        className="bg-white shadow-lg rounded p-4"
        style={{
          width: "100%",
          maxWidth: "500px",
          textAlign: "center",
          borderRadius: "16px",
        }}
      >
        <h2 className="mb-4 fw-bold text-dark">🌱 Start Anonymous Chat</h2>

        {!inviteLink ? (
          <>
            <p className="text-muted mb-4">
              Generate a random name and private chat link. Invite someone to
              chat without revealing your identity.
            </p>
            <button
              className="btn btn-success btn-lg px-4 py-2"
              onClick={handleStartAnonymous}
              disabled={loading}
              style={{ transition: "background 0.3s ease" }}
            >
              {loading ? "Generating..." : "🔗 Generate Chat Link"}
            </button>
          </>
        ) : (
          <>
            <p className="fs-5 mt-3">
              👤 Your Anonymous Name: <strong>{anonName}</strong>
            </p>
            <p className="text-muted">
              Share this link with a friend to start chatting:
            </p>

            <input
              type="text"
              className="form-control text-center mb-3"
              value={inviteLink}
              readOnly
              style={{
                background: "#f8f9fa",
                borderRadius: "8px",
                fontWeight: "bold",
              }}
            />

            <div className="d-grid gap-2">
              <button
                className="btn btn-outline-dark"
                onClick={() => navigator.clipboard.writeText(inviteLink)}
              >
                📋 Copy Invite Link
              </button>

              <button
                className="btn btn-primary"
                onClick={() =>
                  navigate(`/anon-chat/${inviteLink.split("/").pop()}`, {
                    state: { name: anonName },
                  })
                }
              >
                🚀 Join Chat Room
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnonymousChatEntry;
