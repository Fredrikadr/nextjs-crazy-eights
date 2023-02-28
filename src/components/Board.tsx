import { Component } from "react";
import { fetchDeckId } from "../utils/utils.js"

interface BoardState {
  isLoading: boolean;
  currentPlayer: string;
  deckId: string;
  currentSuit: string;
  topCard: TopCard,
  playerHand: any[];
  computerHand: any[];
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
      currentPlayer: "playerHand",
      deckId: "",
      currentSuit: "",
      topCard: {
        image: "",
        value: "",
        suit: "",
        code: "",
      },
      playerHand: [],
      computerHand: []
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


  playCard(card: any) {
    const oldHand = this.state.playerHand;

    if (this.isCardPlayable(card)) {
      fetch(`/api/add/${this.state.deckId}/${card.code}`)
      console.log("added card to discard pile")
      console.log(card)

      const newHand = oldHand.filter((cards) => {
        return cards.code != card.code
      })

      this.setState({
        topCard: card,
        playerHand: newHand
      })
      console.log(this.state.playerHand)
      return;
    }
    console.log("card is not playable")
    return;
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

    if (cardValues.indexOf(card.value) >= cardValues.indexOf(currentValue)) {
      return true;
    }

    return false;
  }

  async drawCard(count: number) {
    let { deckId }: any = this.state;
    const response = await fetch(`/api/draw/${deckId}/${count}`); 
    const data = await response.json();
    const cards = data.cards
    return cards

  }

  async dealCards() {
    const { playerHand, computerHand, deckId } = this.state;
    const playerDraw = await this.drawCard(6);
    const computerDraw = await this.drawCard(6);
    this.setState({
      playerHand: playerDraw,
      computerHand: computerDraw
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
    let { deckId, currentPlayer, isLoading, playerHand, computerHand, topCard}: any = this.state;
    console.log(this.state)

    if (isLoading) {
      return (
        <div>Loading...</div>
      )
    }
    if (!playerHand) {
      return;
    }
    const computerCards = computerHand.map((card: any) => {
      return (<img key={card.code} src={card.image} alt={card.code} ></img>)
    })

    const playerCards = playerHand.map((card: any) => {
      return (<img key={card.code} src={card.image} alt={card.code} onClick={() => this.playCard(card)}></img>)
    })

    
    return (
      <>
        <h1>Crazy Eights</h1>
        <div>{playerHand.length == 0 ? (
          <div>Hand is empty</div>
        ) : (
            <>
              <div>
                <h2>Opponents hand</h2>
                <div>{ computerCards }</div>
              </div>
              <h2>Top Card</h2>
              <div><img alt={topCard.code} src={topCard.image} ></img></div>
              <div>
                <h2>Your hand</h2>
            <div>{playerCards}</div>
              </div>
            
          </>


        )}</div>
        <button onClick={this.dealCards.bind(this)}>Deal</button>
        <button onClick={() => { this.drawCard(1) }}>Draw Card</button>
        <h2>Deck ID: {this.state.deckId}</h2>

      </>
    )
  }
}

