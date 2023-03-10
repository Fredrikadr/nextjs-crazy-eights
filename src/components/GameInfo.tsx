import diamonds from "../assets/diamonds.png"
import clubs from "../assets/clubs.png"
import hearts from "../assets/hearts.png"
import spades from "../assets/spades.png"


import Image from "next/image";


export default function GameInfo(props: any) {
  let currentSuit = props.currentSuit;
  let iconPath;

  switch (currentSuit) {
    case "DIAMONDS":
      iconPath = diamonds;
      break;
    case "HEARTS":
      iconPath = hearts;
      break;
    case "SPADES":
      iconPath = spades;
      break;
    case "CLUBS":
      iconPath = clubs;
      break;
  }

  return (
    <div className="game-info">
      <div>
        {props.currentPlayer === "playerOne" ? <h3 style={{ color: "red" }}>Your Turn</h3> : <h3>Computer is playing...</h3>}
      </div>
      <div>
        <p>Current suit:</p>
        {iconPath && <Image className="suit-icon" alt="current suit" src={iconPath}></Image> }
      </div>
      <div>
        <p>Last move: </p>
        {props.message || "None"}
      </div>
      <p>Draw count: {props.drawCount}</p>
    </div>
  );
}
