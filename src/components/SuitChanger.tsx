export default function SuitChanger(props: any) {
  return (
    <div className="suit-changer">
      <button title="spades" className="spades" onClick={() => props.changeSuit("SPADES")}></button>
      <button title="hearts" className="hearts" onClick={() => props.changeSuit("HEARTS")}></button>
      <button title="diamonds" className="diamonds" onClick={() => props.changeSuit("DIAMONDS")}></button>
      <button title="clubs" className="clubs" onClick={() => props.changeSuit("CLUBS")}></button>
    </div>
  );
}