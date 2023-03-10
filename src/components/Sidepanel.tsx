import SuitChanger from "./SuitChanger";

export default function Sidepanel(props: any) {
  return (
    <div className="sidepanel">
      {props.changingSuit && props.currentPlayer === "playerOne" && <SuitChanger changeSuit={props.changeSuit} />}
      
    </div>
  );
}