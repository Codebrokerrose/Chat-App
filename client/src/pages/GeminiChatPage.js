import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
  MessageSeparator,
} from "@chatscope/chat-ui-kit-react";

import geminiAvatar from "../assets/images/favicon/ai.avif";
import userAvatar from "../assets/images/avtar.jpg";

// Utility function to strip markdown stars and apply clean formatting
const formatResponse = (text) => {
  return text
    .replace(/\*\*\*(.*?)\*\*\*/g, "$1")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/^\s*[-*]\s+/gm, "• ")
    .replace(/\n{3,}/g, "\n\n") // reduce multiple line breaks
    .replace(/\n/g, "<br>"); // convert line breaks for HTML rendering
};

function GeminiChatPage() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm AI! How can I help you today?",
      direction: "incoming",
      sender: "Gemini",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "You",
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      

      const data = await res.json();
      setMessages([
        ...updatedMessages,
        {
          message: formatResponse(data.response),
          sender: "Gemini",
          direction: "incoming",
        },
      ]);
    } catch (err) {
      console.error("❌ Frontend fetch error:", err);
      setMessages([
        ...updatedMessages,
        {
          message: "Something went wrong. Please try again.",
          sender: "Gemini",
          direction: "incoming",
        },
      ]);
    }

    setIsTyping(false);
  };

  const colors = darkMode
    ? {
        background: "#ffe4f0",
        container: "#f8d8ff",
        msgGemini: "#fff0fa",
        msgUser: "#d0f0ff",
        textGemini: "#8b3d8b",
        textUser: "#004b6b",
        borderTop: "#ffbde1",
        buttonBg: "#ff90bc",
        buttonText: "#ffffff",
        headerText: "#8b3d8b",
        subText: "#9b5ba4",
      }
    : {
        background: "#f1f5f9",
        container: "#ffffff",
        msgGemini: "#e2e8f0",
        msgUser: "#bbf7d0",
        textGemini: "#0f172a",
        textUser: "#0f172a",
        borderTop: "#cbd5e1",
        buttonBg: "#3b82f6",
        buttonText: "#ffffff",
        headerText: "#0f172a",
        subText: "#475569",
      };

  return (
    <div
      style={{
        height: "100vh",
        background: colors.background,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Comic Neue', sans-serif",
        padding: "20px",
        position: "relative",
      }}
    >
      {/* Home Button */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "30px",
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "8px 16px",
            backgroundColor: colors.buttonBg,
            color: colors.buttonText,
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ⬅ Home
        </button>
      </div>

      {/* Theme Toggle Button */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "30px",
        }}
      >
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            padding: "8px 16px",
            backgroundColor: colors.buttonBg,
            color: colors.buttonText,
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {darkMode ? "🌞 Light" : "🌸 Cute"}
        </button>
      </div>

      {/* Chat Container */}
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          height: "85vh",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 0 20px rgba(0,0,0,0.35)",
          background: colors.container,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Custom Chat Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "14px 20px",
            borderBottom: `1px solid ${colors.borderTop}`,
          }}
        >
          <img
            src={geminiAvatar}
            alt="Gemini"
            style={{ width: "45px", height: "45px", borderRadius: "50%" }}
          />
          <div>
            <p
              style={{
                margin: 0,
                fontWeight: "bold",
                color: colors.headerText,
                fontSize: "1.2rem",
              }}
            >
              Chat with Me
            </p>
            <p style={{ margin: 0, color: colors.subText, fontSize: "0.9rem" }}>
              Your friendly AI assistant 🤖
            </p>
          </div>
        </div>

        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={
                isTyping ? (
                  <TypingIndicator content="Gemini is typing..." />
                ) : null
              }
              style={{
                backgroundColor: colors.background,
                padding: "20px",
              }}
            >
              <MessageSeparator content="Today" />
              {messages.map((msg, i) => (
                <Message
                  key={i}
                  model={msg}
                  avatarSrc={
                    msg.sender === "Gemini" ? geminiAvatar : userAvatar
                  }
                  style={{
                    backgroundColor:
                      msg.sender === "Gemini"
                        ? colors.msgGemini
                        : colors.msgUser,
                    color:
                      msg.sender === "Gemini"
                        ? colors.textGemini
                        : colors.textUser,
                    borderRadius: "12px",
                    padding: "8px 12px",
                    marginBottom: "8px",
                    maxWidth: "100%",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.sender === "Gemini" ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: msg.message }}
                      style={{ lineHeight: "1.6", fontSize: "0.95rem" }}
                    />
                  ) : (
                    <div style={{ lineHeight: "1.6", fontSize: "0.95rem" }}>
                      {msg.message}
                    </div>
                  )}
                </Message>
              ))}
            </MessageList>

            <MessageInput
              placeholder="Type your message here..."
              onSend={handleSend}
              style={{
                backgroundColor: colors.container,
                borderTop: `1px solid ${colors.borderTop}`,
              }}
            />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default GeminiChatPage;
