import Image from "next/image";
import SuitChanger from "./SuitChanger";

export default function TopCard(props: any) {
  return (
    <>
      <div className="topCard">
        <img src={props.image} alt={props.code} 
        />
        <div className="suit-changer">
          {props.changingSuit && props.currentPlayer === "playerOne" && <SuitChanger changeSuit={props.changeSuit} />}
        </div>
      </div>
    </>
  );
}