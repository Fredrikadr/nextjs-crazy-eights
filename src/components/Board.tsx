import { Component } from "react";
import { fetchDeckId } from "../utils/utils.js"

interface BoardState {
  isLoading: boolean;
  currentPlayer: string;
  deckId: string;
  currentSuit: string;
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
      currentPlayer: "playerOne",
      deckId: "",
      currentSuit: "",
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

  async handlefetchDeckId() {
    this.setState({ isLoading: true })
    const deckId = await fetchDeckId();
    console.log("fetching")
    this.setState({
      deckId,
      isLoading: false
    })


  }
  shuffleDeck() {

  }

  shuffleDiscardPile() {

  }

  computerTurn() {
    //check if any cards on hand is playable
    //else check if any eights on hand -> change suit based on current hand
    //else draw card
    //repeat
  }

  switchTurn() {
    const { currentPlayer } = this.state;
    const nextPlayer = currentPlayer === "playerOne" ? "playerTwo" : "playerOne";
    this.setState({
      currentPlayer: nextPlayer
    })

  }

  changeSuit() {

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
        [playerHand]: newHand
      } as Pick<BoardState, keyof BoardState>);
      this.switchTurn();
      return;
    }
    console.log("card is not playable")
    return;
  }


  checkHandforPlayable() {
    //Checks if there are playable cards in current players hand
    const { currentPlayer} = this.state;
    const playerHand = currentPlayer === "playerOne" ? "playerOneHand" : "playerTwoHand"
    const oldHand = this.state[playerHand];
    
    return (oldHand.filter(card => this.isCardPlayable(card)).length === 0 ? false : true) 
  }

  isCardPlayable(card: any) {
    const currentSuit = this.state.topCard.suit;
    const currentValue = this.state.topCard.value;
    console.log(this.state.topCard)
    const cardValues = ["2", "3", "4", "5", "6", "7", "9", "JACK", "QUEEN", "KING", "ACE"]

    if (this.state.topCard.value === "8" && card.suit != currentSuit)
      return false;

    if (card.value === "8") {
      // this.changeSuit();
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
    const { currentPlayer, playerOneHand, playerTwoHand } = this.state;
    const playerHand = currentPlayer === "playerOne" ? "playerOneHand" : "playerTwoHand"
    const oldHand = this.state[playerHand];

    if (!this.checkHandforPlayable()) {
      console.log("no playable cards. drawing 1")
      let newCard = await this.drawCard(1);
      let newHand = oldHand.concat(newCard);

      this.setState({
        [playerHand]: newHand
      } as unknown as Pick<BoardState, keyof BoardState>);
   

      //set state to new hand

    } else {
      console.log("you have playable cards. no cards drawn")
    }
  }

  async drawCard(count: number) {

    //TODO: show number of remaining cards

    let { deckId }: any = this.state;
    const response = await fetch(`/api/draw/${deckId}/${count}`);
    const data = await response.json();
    const cards = data.cards
    return cards

  }

  async dealCards() {
    const { playerOneHand, playerTwoHand, deckId } = this.state;
    const playerDraw = await this.drawCard(6);
    const computerDraw = await this.drawCard(6);
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
      topCard: newTopCard
    })
    return card
  }



  async componentDidMount() {
    const { deckId } = this.state;
    if (!deckId) {
      await this.handlefetchDeckId();
    }

    console.log(this.state.deckId, "finished fetching")
    console.log("mounting")
  }


  render() {

    let { currentPlayer, isLoading, playerOneHand, playerTwoHand, topCard }: any = this.state;
    console.log(this.state)

    if (isLoading) {
      return (
        <div>Loading...</div>
      )
    }
    const playerTwoCards = playerTwoHand
      .map((card: any) => {
        return (
          <img
            key={card.code}
            src={card.image}
            alt={card.code}

            onClick={() => currentPlayer === "playerTwo" ? this.playCard(card) : null}
          />
        );
      })

    const playerOneCards = playerOneHand
      .map((card: any) => {
        return (
          <img
            key={card.code}
            src={card.image}
            alt={card.code}
            onClick={() => currentPlayer === "playerOne" ? this.playCard(card) : null}
          />
        );
      })


    return (
      <>
        <h1>Crazy Eights</h1>
        <h2>Current player: {currentPlayer === "playerOne" ? "Player one" : "Player two"}</h2>
        <div>{playerOneHand.length == 0 ? (
          <div>Hand is empty</div>
        ) : (
          <>
            <div>
              <h2>Opponents hand</h2>
              <div>{playerTwoCards}</div>
            </div>
            <h2>Top Card</h2>
            <div><img alt={topCard.code} src={topCard.image} ></img></div>
            <div>
              <h2>Your hand</h2>
              <div>{playerOneCards}</div>
            </div>

          </>


        )}</div>
        <button onClick={this.dealCards.bind(this)}>Deal</button>
        {this.state.currentPlayer === "playerOne" &&
          <button onClick={() => { this.handleDraw() }}>Draw Card</button>}
        <h2>Deck ID: {this.state.deckId}</h2>

      </>
    )
  }
}

