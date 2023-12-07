import Child from "./child";

export interface Props {
    nom: string;
    prenom : string;
    setTime: (time:Date) => void;
    time:Date;
  }
  


const Parent = ({setTime,nom,prenom}:Props) => {
    nom = "Dupont";
    prenom ="Jean"
  return (
    <div>
      <h2>Parent</h2>
      <Child setTime={setTime} nom={nom} prenom={prenom}  />
    </div>
  );
};
export default Parent;
