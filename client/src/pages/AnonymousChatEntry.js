import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const fruitsAndVeggies = [
  "Apple", "Banana", "Carrot", "Tomato", "Mango", "Peach", "Potato", "Broccoli", "Cucumber", "Grape", "Onion", "Pumpkin", "Kiwi", "Radish", "Spinach", "Pear", "Cherry", "Lettuce", "Melon", "Orange"
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
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/anon-session`, { name: randomName });
      const { sessionId } = response.data;
      setAnonName(randomName);
      setInviteLink(`${window.location.origin}/anon-chat/${sessionId}`);
    } catch (err) {
      alert("Failed to start anonymous chat. Try again later.");
    }
    setLoading(false);
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <h2>Start Anonymous Chat</h2>
      {!inviteLink ? (
        <button className="btn btn-primary mt-3" onClick={handleStartAnonymous} disabled={loading}>
          {loading ? "Generating..." : "Generate Anonymous Chat Link"}
        </button>
      ) : (
        <div className="mt-4 text-center">
          <p>Your anonymous name: <b>{anonName}</b></p>
          <p>Share this link to chat anonymously:</p>
          <input type="text" className="form-control mb-2" value={inviteLink} readOnly />
          <button className="btn btn-outline-secondary" onClick={() => navigator.clipboard.writeText(inviteLink)}>
            Copy Link
          </button>
          <div className="mt-3">
            <button className="btn btn-success" onClick={() => navigate(`/anon-chat/${inviteLink.split('/').pop()}`)}>
              Go to Chat Room
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnonymousChatEntry;
