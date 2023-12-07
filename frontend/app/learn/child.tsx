'use client'
export interface Props {
  nom: string;
  prenom: string;
  setTime: (time:Date) => void;
}

const Child = ( { setTime , nom, prenom }: Props) => {
  return (
    <div>
      <h1>Enfant</h1>
      <p>nom = {nom}</p>
      <p>prenom = {prenom}</p>
      <div>
        <button onClick={() => setTime(new Date())}>Set Time</button>
      </div>
    </div>
  );
};
export default Child;
