"use client";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import SendMessages from "../../component/chat/sendMessage";
import Messages from "../../component/chat/messages";
import Username from "../../component/chat/username";

const socket = io("http://localhost:3000");

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connecté", socket.id);
    });

    socket.once("messages-old", (data) => {
      setMessages((msg) => [...msg, ...data] as any);
    });

    socket.on("chat-message", (data) => {
      setMessages((msg) => [...msg, data] as any);
    });

    socket.on('chat-translate', (data) => {
      setMessages((msg) => {
        const messageIndex = msg.findIndex((m) => m.timeSent === data.timeSent);
        const updatedMessages = [...msg];

        if (messageIndex !== -1) {
          updatedMessages[messageIndex] = {
            ...msg[messageIndex],
            content: data.content, // Mettez à jour le contenu traduit
          };
        }

        return updatedMessages;
      });
    });
  }, []);

  return (
    <div>
      <h1>Chat</h1>
      <br></br>
      <Username setUsername={setUsername} socket={socket} />
      <SendMessages socket={socket} username={username}/>
      <Messages
        messages={messages}
        username={username}
        socket={socket}
      />
    </div>
  );
};

export default Chat;
