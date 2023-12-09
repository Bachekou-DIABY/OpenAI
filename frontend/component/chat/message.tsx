"use client";
import { useState } from "react";
import { Socket } from "socket.io-client";

export interface IMessage {
  username: string;
  content: string;
  timeSent: string;
}

interface Props {
  socket:Socket;
  username: string;
  message: IMessage;
  isMe: boolean;
  translatedContent?: IMessage;
}
const Message = ({socket, username, message, isMe, translatedContent }: Props) => {
  const [text, setText] = useState("");

  const handleTranslate = (e: React.FormEvent) => {
    e.preventDefault();
    if (text != null || text != "") {
      socket.emit("chat-translate", {
        username,
        targetLanguage: text,
        content:message.content,
        timeSent: message.timeSent,
      });
      setText("");
    }
  };

  return (
    <div className= {` chat ${isMe ? "chat-start" : "chat-end"}`}>
      <div className="chat-header">
        {message.username}
        <time className="text-xs opacity-50">{message.timeSent}</time>
      </div>
      <div
        className={`chat-bubble ${isMe ? "chat-bubble-primary" : "chat-bubble-secondary"}`}
      >
        {translatedContent?.content || message.content}
      </div>
      <form onSubmit={handleTranslate} className="chat-footer">
          <input 
          placeholder="Indiquez la langue voulue"
          className="rounded-lg pl-3 my-2 mr-2"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button>Traduire</button>
      </form>
    </div>
  );
};

export default Message;