import SuitChanger from "./SuitChanger";

export default function Sidepanel(props: any) {
  return (
    <div className="sidepanel">
      
      <div>
        <p>Last move: </p>
        {props.message || "None"}
      </div>
      <div>
        {props.currentPlayer === "playerOne" ? <h3 style={{ color: "red" }}>Your Turn</h3> : <h3>Computer is playing...</h3>}
      </div>
      <div>
        <p>Current suit:</p>
        {props.currentSuit}
      </div>
      {props.changingSuit && props.currentPlayer === "playerOne" && <SuitChanger changeSuit={props.changeSuit} />}
      <p>Draw count: {props.drawCount}</p>
    </div>
  );
}