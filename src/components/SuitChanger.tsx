export default function SuitChanger(props: any) {
  return (
    <div className="suitChanger">
      <p>Change suit:</p>
      <button onClick={() => props.changeSuit("SPADES")}>Spades</button>
      <button onClick={() => props.changeSuit("HEARTS")}>Hearts</button>
      <button onClick={() => props.changeSuit("DIAMONDS")}>Diamonds</button>
      <button onClick={() => props.changeSuit("CLUBS")}>Clubs</button>
    </div>
  );
}