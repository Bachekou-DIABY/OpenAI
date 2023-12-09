"use client";
import { useState } from "react";
import { Socket } from "socket.io-client";

export interface Props {
  socket: Socket;
  username: string;
  lastMessage:string
}

const SendMessage = ({ socket, username,lastMessage }: Props) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text != null || text != "") {
      socket.emit("chat-message", {
        username,
        content: text,
        timeSent: new Date().toISOString(),
      });
      setText("");
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    socket.emit("chat-verify", {
      username: username,
      content: lastMessage,
      timeSent: new Date().toISOString(),
    });
  };

  return (
    <div className="m-5 fixed bottom-0 w-full ">
      <div className="m-5 fixed bottom-0 ">
        <button onClick={handleVerify} className="bottom-0 btn btn-accent" type="submit">
          Vérifier le dernier message
        </button>
      </div>
      <form onSubmit={handleSubmit}
        className="flex justify-center"
      >
          <input
            placeholder="Ecrivez votre message"
            className=" w-6/12 p-3 rounded-lg mr-2"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="flex btn btn-accent" type="submit">Envoyer</button>
      </form>
    </div>
  );
};

export default SendMessage;
