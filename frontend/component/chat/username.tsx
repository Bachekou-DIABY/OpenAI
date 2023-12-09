import { useState } from "react"
import { Socket } from "socket.io-client";

export interface Props {
  socket:Socket;
  setUsername:(username: string) => void;
}


const Username = ({socket, setUsername}: Props) => {
  const [text,setText] = useState("");

  const handleSubmit = (e: React.FormEvent)  => {
    e.preventDefault();
    setUsername(text);
    socket.emit("username-set",{
      username:text,
    })
  };

  return (
    <form className="m-3" onSubmit={handleSubmit}>
      <input 
        placeholder="Entrez votre nom d'utilisateur"
        className="rounded-lg my-2 mr-2 p-3"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className="btn btn-accent" type="submit">Valider</button>
    </form>
  )
}

export default Username;