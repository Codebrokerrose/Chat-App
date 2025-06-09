// src/pages/GeminiChatPage.js

import { useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

function GeminiChatPage() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm Gemini! Ask me anything.",
      direction: "incoming",
      sender: "Gemini",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setMessages([
        ...newMessages,
        {
          message: data.response,
          sender: "Gemini",
          direction: "incoming",
        },
      ]);
    } catch (err) {
      console.error("❌ Frontend fetch error:", err);
      setMessages([
        ...newMessages,
        {
          message: "Something went wrong. Please try again.",
          sender: "Gemini",
          direction: "incoming",
        },
      ]);
    }

    setIsTyping(false);
  };

  return (
    <div className="App">
      <div
        style={{
          position: "relative",
          height: "800px",
          width: "700px",
          margin: "auto",
        }}
      >
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={
                isTyping ? (
                  <TypingIndicator content="Gemini is typing..." />
                ) : null
              }
            >
              {messages.map((msg, i) => (
                <Message key={i} model={msg} />
              ))}
            </MessageList>
            <MessageInput placeholder="Type a message..." onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default GeminiChatPage;
