import cardback from "../assets/cardback.png";
import Image from "next/image";
import SuitChanger from "./SuitChanger";

export default function DrawPile(props: any) {
  return (
    <>
      <div className="topCard">
        <Image src={cardback} alt="card back" onClick={() => !props.changingSuit ? props.handleDraw() : null}
        />
{/*       <div className="suit-changer">
        {props.changingSuit && props.currentPlayer === "playerOne" && <SuitChanger changeSuit={props.changeSuit} />}
      </div> */}
      </div>
    </>
  );
}