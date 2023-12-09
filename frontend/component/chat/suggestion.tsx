// Suggestion.js
import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { IMessage } from './message';

interface Props {
  socket: Socket;
  messages: IMessage[];
  username: string;
}

const Suggestion = ({ socket, username, messages }: Props) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const handleSuggestions = async () => {
      if (messages && messages.length >= 3) {
        const lastThreeMessages = messages.slice(-3).map((message) => message.content);
        socket.emit('chat-suggestions', {
          username: username,
          messages: lastThreeMessages,
        });
      }
    };
    handleSuggestions();
    socket.on('chat-suggestions', (data) => {
      setSuggestions(data.content);
    });

    return () => {
      socket.off('chat-suggestions');
    };
  }, [socket, username, messages]);

  const handleSuggestionClick = (suggestion: string) => {
    socket.emit("chat-message", {
      username,
      content: suggestion,
      timeSent: new Date().toISOString(),
    });  
    messages = []
  };

  return (
    <div className='pt-5 flex justify-center items-center'>
      <h3>Suggestions de réponse :</h3>
      <div >
        {suggestions.map((suggestion, index) => (
          <button className='btn btn-ghost' key={index} onClick={() => handleSuggestionClick(suggestion)}>
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Suggestion;
