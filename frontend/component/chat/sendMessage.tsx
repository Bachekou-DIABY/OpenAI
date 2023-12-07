"use client";
import { useState } from "react";
import { Socket } from "socket.io-client";

export interface Props {
  socket: Socket;
  username:string;
}

const SendMessage = ({ socket,username}: Props) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    socket.emit("chat-message", {
      username,
      content: text,
      timeSent: new Date().toISOString(),
    });
    setText("");
  };

  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SendMessage;
