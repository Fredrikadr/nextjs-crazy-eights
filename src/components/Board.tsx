import { count } from "console";
import { Component } from "react";
import { fetchDeckId, sleep } from "../utils/utils";
import Sidepanel from "./Sidepanel";
import SuitChanger from "./SuitChanger";
import cardback from "../assets/cardback.png";
import Image from "next/image";


interface BoardState {
  isLoading: boolean;
  changingSuit: boolean
  currentPlayer: string;
  deckId: string;
  currentSuit: string;
  message: string;
  drawCount: number;
  topCard: TopCard,
  playerOneHand: any[];
  playerTwoHand: any[];
}

interface TopCard {
  image: string
  value: string,
  suit: string,
  code: string,
}



export default class Board extends Component<{}, BoardState> {
  constructor(props: any) {
    super(props)
    this.state = {
      isLoading: false,
      changingSuit: false,
      currentPlayer: "playerOne",
      deckId: "",
      currentSuit: "",
      message: "",
      drawCount: 0,
      topCard: {
        image: "",
        value: "",
        suit: "",
        code: "",
      },
      playerOneHand: [],
      playerTwoHand: []
    }

  }

  winCheck(currentPlayerHand: any[]) {
    const { currentPlayer } = this.state;
    if (currentPlayerHand.length === 0) {
      this.setState({
        message: `${currentPlayer} wins!`,
        currentPlayer: "",
      })
      return true
    } else return false;
  }

  async handlefetchDeckId() {
    console.log("calling fetch deck id!!!!!!!!!!!!!!!!!!")
    const deckId = await fetchDeckId();
    return deckId;
  }


  async shuffleDeck() {
    const { deckId, topCard } = this.state;
    await fetch(`/api/shuffle/${deckId}/${topCard.code}`)

    //TODO: Check if deck is shuffled
  }


  async computerTurn() {
    //check if any cards on hand is playable
    //else check if any eights on hand -> change suit based on current hand
    //else draw card
    //repeat
    console.log("computer playing")
    let playableCards = this.checkHandforPlayable();
    let drawCount = 0;
    while (playableCards.length === 0 && drawCount < 3) {
      await this.handleDraw();
      console.log(drawCount)
      drawCount++
      playableCards = this.checkHandforPlayable();
      await sleep(1000);
    }

    if (drawCount === 3 && playableCards.length === 0) {
      this.switchTurn();
      return;
    }

    if (playableCards[0].value == "8" && playableCards.length === 1) {
      this.playCard(playableCards[0]);
      let maxSuit = this.checkHandForMost();

      await sleep(1500);

      this.setState({
        currentSuit: maxSuit,
        changingSuit: false
      });

    } else {
      this.playCard(playableCards[0])
    }

    this.switchTurn()
  }

  switchTurn() {
    const { currentPlayer } = this.state;
    const nextPlayer = currentPlayer === "playerOne" ? "playerTwo" : "playerOne";
    this.setState({
      currentPlayer: nextPlayer,
      drawCount: 0
    })
    if (nextPlayer === "playerTwo") {
      setTimeout(() => {
        this.computerTurn();
      }, 2000);
      return;
    }


  }

  changeSuit(suit: string) {
    this.setState({
      currentSuit: suit,
      changingSuit: false
    });
    this.switchTurn();

  }


  playCard(card: any) {
    const { currentPlayer } = this.state;
    const playerHand = currentPlayer === "playerOne" ? "playerOneHand" : "playerTwoHand"
    const oldHand = this.state[playerHand];

    if (this.isCardPlayable(card)) {
      fetch(`/api/add/${this.state.deckId}/${card.code}`)
      console.log("added card to discard pile")
      console.log(card)

      const newHand = oldHand.filter((cards) => {
        return cards.code != card.code;

      })


      this.setState({
        topCard: card,
        [playerHand]: newHand,
        message: `${currentPlayer} played ${card.code}`
      } as Pick<BoardState, keyof BoardState>);


      if (this.winCheck(newHand)) {
        return;
      }

      if (card.value != "8") {
        this.setState({
          currentSuit: card.suit
        });
        this.switchTurn();
      } else if(currentPlayer == "playerOne"){
        this.setState({
          changingSuit: true
        })
      }
      return;
    }
    console.log("card is not playable")
    return;
  }


  checkHandForMost() {
    const { currentPlayer, playerOneHand, playerTwoHand } = this.state;
    let hand = currentPlayer === "playerOne" ? playerOneHand : playerTwoHand;
    let suits: { [key: string]: number } = {
      "HEARTS": 0,
      "DIAMONDS": 0,
      "SPADES": 0,
      "CLUBS": 0
    };

    hand.forEach((card: { suit: string }) => {
      suits[card.suit] += 1;
    })


    let maxCount = 0;
    let maxSuit = "";
    for (let suit in suits) {
      if (suits[suit] > maxCount) {
        maxCount = suits[suit];
        maxSuit = suit;
      }
    }
    return maxSuit;
  }

  checkHandforPlayable() {
    //Checks if there are playable cards in current players hand
    const { currentPlayer } = this.state;
    const playerHand = currentPlayer === "playerOne" ? "playerOneHand" : "playerTwoHand"
    const oldHand = this.state[playerHand];
    const playableCards = oldHand.filter(card => this.isCardPlayable(card))
    console.log(playableCards)
    return (playableCards)
  }

  isCardPlayable(card: any) {
    const { currentSuit, topCard } = this.state;
    const currentValue = topCard.value;
    console.log(this.state.topCard, currentSuit)
    const cardValues = ["2", "3", "4", "5", "6", "7", "9", "JACK", "QUEEN", "KING", "ACE"]

    if (topCard.value == "8" && card.value == "8") {
      return false;
    }
    if (topCard.value === "8" && card.suit != currentSuit)
      return false;

    if (card.value === "8") {
      return true;
    }
    if (card.suit === currentSuit) {
      return true;
    }

    if (cardValues.indexOf(card.value) === cardValues.indexOf(currentValue)) {
      return true;
    }

    return false;
  }


  async handleDraw() {
    //TODO: fix double clicking
    const { currentPlayer, playerOneHand, playerTwoHand } = this.state;
    const playerHand = currentPlayer === "playerOne" ? "playerOneHand" : "playerTwoHand"
    const oldHand = this.state[playerHand];

    if (this.checkHandforPlayable().length === 0) {
      console.log("no playable cards. drawing 1")
      let newCard = await this.drawCard(1);
      let newHand = oldHand.concat(newCard);

      this.setState({
        [playerHand]: newHand,
        
      } as unknown as Pick<BoardState, keyof BoardState>);


    } else {
      console.log("you have playable cards. no cards drawn")
    }
  }

  async drawCard(count: number) {

    let { deckId }: any = this.state;
    const response = await fetch(`/api/draw/${deckId}/${count}`);
    const data = await response.json();
    const cards = data.cards
    if (data.cards.length === 0) {
      await this.shuffleDeck();
      const response = await fetch(`/api/draw/${deckId}/${count}`);
      const data = await response.json();
      const cards = data.cards
      return cards
    }
    console.log(data.remaining, "remaining")
    return cards

  }

  async dealCards() {
    //TODO: implement drawing all cards and then dealing them
    const { deckId } = this.state;
    if (!deckId) {
      return;
    }
    const playerDraw = await this.drawCard(6);
    const computerDraw = await this.drawCard(6);
    console.log("dealing cards")
    this.setState({
      playerOneHand: playerDraw,
      playerTwoHand: computerDraw
    });
    this.initialDraw();
  }


  async initialDraw() {
    const card = await this.drawCard(1)
    const newTopCard = card[0]
    this.setState({
      topCard: newTopCard,
      currentSuit: card[0].suit
    })

    //Add card to discard pile
    await fetch(`/api/add/${this.state.deckId}/${newTopCard.code}`)
    return card
  }

  /*   async startGame() {
      const deckId = await this.handlefetchDeckId();
      this.setState({
        deckId
      })
      await this.dealCards();
    } */


  async componentDidMount() {
    const { deckId } = this.state;
    if (!deckId) {
      this.setState({
        isLoading: true
      })
      const response = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
      const data = await response.json();
      const id = data.deck_id
      this.setState({
        deckId: id,
        isLoading: false
      })
    }

    console.log("mounting");
  }


  render() {

    let { currentPlayer, isLoading, playerOneHand, playerTwoHand, topCard, changingSuit, message , currentSuit, drawCount}: any = this.state;
    console.log(this.state)
    console.log(this.state.currentSuit)

    if (isLoading) {
      return (
        <div>Loading...</div>
      )
    }


    const playerTwoCardsHidden = playerTwoHand.map((card: any, i: number) => {
      return (
        <Image key={i} className="card" src={cardback} alt="card back"/>
      )
    })

    console.log(cardback, "cardback")

    const playerTwoCards = playerTwoHand
      .map((card: any, i: number) => {
        return (
          <img
            className="card"
            key={card.code}
            src={card.image}
            alt={card.code}

            onClick={() => currentPlayer === "playerTwo" && !changingSuit ? this.playCard(card) : null}
          />
        );
      })

    const playerOneCards = playerOneHand
      .map((card: any) => {
        return (
          <img
            className="card"
            key={card.code}
            src={card.image}
            alt={card.code}
            onClick={() => currentPlayer === "playerOne" && !changingSuit ? this.playCard(card) : null}
          />
        );
      })


    return (
      <>
        
        <h1>Crazy Eights</h1>
        <button onClick={() => this.dealCards()}>Deal</button>
        <h2>Current player: {currentPlayer === "playerOne" ? "Player one" : "Player two"}</h2>
        <div>
            <div className="grid-container">
          <>
              <div className='gameBoard'>
                <div>
                  <div className="handContainer">{playerTwoCardsHidden}</div>
                </div>
                <div className="middleBoard">

                  <div ><img
                    className="topCard"
                    alt={topCard.code}
                    src={topCard.image}
                  ></img></div>
                </div>

                <div>
                  <div className="handContainer">{playerOneCards}</div>
                </div>
              </div>
            </>
            <Sidepanel
              message={message}
              currentSuit={currentSuit}
              currentPlayer={currentPlayer}
              changingSuit={changingSuit}
              changeSuit={this.changeSuit.bind(this)}
              handleDraw={this.handleDraw.bind(this)}
              drawCount={drawCount}
            />
          </div>
          
        </div>

       

        <h2>Deck ID: {this.state.deckId}</h2>

      </>
    )
  }
}

