import Parent from './parent';
export interface Props {
    nom: string;
    prenom:string;
    setTime: (time:Date) => void;

  }
  

const Learn = ({setTime,nom,prenom}:Props) => {
  return (
    <div>
      <Parent nom={nom} prenom={prenom} setTime={setTime} />
    </div>
  );
};
export default Learn;