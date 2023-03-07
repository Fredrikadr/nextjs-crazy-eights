import SuitChanger from "./SuitChanger";

export default function Sidepanel(props: any) {
  return (
    <div className="sidepanel">
      <div>
        {props.currentPlayer === "playerOne" ? <h3 style={{color: "red"}}>Your Turn</h3> : <h3>Computer is playing...</h3>}
      </div>
      <div>
      <p>Last move: </p>
        {props.message || "None"  }
      </div>
      <div>
        <p>Current suit:</p>
        {props.currentSuit}
      </div>
      {props.changingSuit && props.currentPlayer === "playerOne" && <SuitChanger changeSuit={props.changeSuit} />}
      <button onClick={() => !props.changingSuit ? props.handleDraw() : null}>Draw Card</button>
    </div>
  );
}