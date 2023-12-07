import React from "react";
import { IMessage } from "./message";
import Message from "./message";
import { Socket, io } from "socket.io-client";

const socket = io("http://localhost:3000");

interface MessagesProps {
  socket:Socket;
  messages: IMessage[];
  username: string;
}

const Messages: React.FC<MessagesProps> = ({ messages, username }) => {

  return (
    <div>
      {messages.map((message) => (
        <div key={message.timeSent}>
          <Message
            username={username}
            socket={socket}
            key={message.timeSent}
            message={message}
            isMe={message.username === username}
          />
        </div>
      ))}
    </div>
  );
};

export default Messages;
