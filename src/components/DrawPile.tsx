import cardback from "../assets/cardback.png";
import Image from "next/image";

export default function DrawPile(props: any) {
  return (
    <Image className="topCard" src={cardback} alt="card back" onClick={() => !props.changingSuit ? props.handleDraw() : null} />
  );
}