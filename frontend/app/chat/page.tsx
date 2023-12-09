"use client";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import SendMessages from "../../component/chat/sendMessage";
import Messages from "../../component/chat/messages";
import Username from "../../component/chat/username";
import Verify  from "../../component/chat/suggestion";
import Suggestion from "../../component/chat/suggestion";

const socket = io("http://localhost:3000");

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [lastMessage, setLastMessage] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    socket.once("messages-old", (data) => {
      setMessages((msg) => [...msg, ...data] as any);
    });

    socket.on("chat-message", (data) => {
      setMessages((msg) => [...msg, data] as any);
      setLastMessage(data.content);
    });

    socket.on('chat-translate', (data) => {
      setMessages((msg) => {
        const messageIndex = msg.findIndex((m) => m.timeSent === data.timeSent);
        const updatedMessages = [...msg];

        if (messageIndex !== -1) {
          updatedMessages[messageIndex] = {
            ...msg[messageIndex],
            content: data.content,
          };
        }

        return updatedMessages;
      });
    });

    socket.on("chat-verify", (data) => {
      setMessages((msg) => [...msg, data] as any);
      setLastMessage(data.content);
    });

    socket.on("chat-verify", (data) => {
      setSuggestions(data.content);
    });

  }, []);

  return (
    <div className="h-screen flex flex-col">

      <div className="bg-neutral h-[13%]">
        <h2 className="pt-5 flex justify-center">
          {username
            ? `Vous êtes connecté sous le nom d'utilisateur : ${username}`
            : "AI Chat"}
        </h2>
          {username ? (
            ""
          ) : (
            <Username setUsername={setUsername} socket={socket} />
          )}
      </div>
      <div className=" overflow-y-auto h-[70%]">
        <Messages messages={messages} username={username} socket={socket} />
      </div>
      <div
      className="bg-neutral h-[17%] w-full ">
        <Suggestion socket={socket} messages={messages} username={username} />
        <SendMessages socket={socket} username={username} lastMessage={lastMessage}  />
      </div>
    </div>
  );
};

export default Chat;
