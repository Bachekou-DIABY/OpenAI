"use client";

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
  const handleTranslate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetLanguage = e.target.value;
    socket.emit('chat-translate', {
      username,
      timeSent: message.timeSent,
      content: message.content,
      targetLanguage: targetLanguage,
    });
    console.log(message.username,message.timeSent,message.content,targetLanguage)

  };

  return (
    <div className={`chat ${isMe ? "chat-start" : "chat-end"}`}>
      <div className="chat-header">
        {message.username}
        <time className="text-xs opacity-50">{message.timeSent}</time>
      </div>
      <div
        className={`chat-bubble ${isMe ? "chat-bubble-primary" : "chat-bubble-secondary"}`}
      >
        {translatedContent?.content || message.content}
      </div>
      <div className="chat-footer">
        <label >Traduction: </label>
        <select
          onChange={handleTranslate}
        >
          <option value="">Langue</option>
          <option value="French">Français</option>
          <option value="English">Anglais</option>
          <option value="Spanish">Espagnol</option>
        </select>
      </div>
    </div>
  );
};

export default Message;
