import { Component } from "react";
import { fetchDeckId } from "../utils/utils.js"

let newDeck = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";


interface BoardState {
  isLoading: boolean;
  currentPlayer: string;
  deckId: string;
  currentSuit: string;
  deck: any;
  playerHand: any[];
  computerHand: any[];
}



export default class Board extends Component<{}, BoardState> {
  constructor(props: any) {
    super(props)
    this.state = {
      isLoading: false,
      currentPlayer: "playerHand",
      deckId: "",
      currentSuit: "",
      deck: {},
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


  addToPile() {

  }

  async drawCard(deckId: string, count: number) {
    let { playerHand }: any = this.state;
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`);
    const data = await response.json();
    const cards = data.cards
    return data.cards;

  }

  async dealCards() {
    const { playerHand, computerHand, deckId } = this.state;
    const playerDraw = await this.drawCard(deckId, 6);
    const computerDraw = await this.drawCard(deckId, 6);
    this.setState({
      playerHand: playerDraw,
      computerHand: computerDraw

    });


  }

  getComputerDeck() {

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
    let { deckId, currentPlayer, isLoading, playerHand, computerHand}: any = this.state;
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
      return (<img key={card.code} src={card.image} alt={card.code}></img>)
    })

    const playerCards = playerHand.map((card: any) => {
      return (<img key={card.code} src={card.image} alt={card.code}></img>)
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
              <div>
                <h2>Your hand</h2>
            <div>{playerCards}</div>
              </div>
            
          </>


        )}</div>
        <button onClick={this.dealCards.bind(this)}>Deal</button>
        <button onClick={() => { this.drawCard(deckId, 1) }}>Draw Card</button>
        <h2>Deck ID: {this.state.deckId}</h2>

      </>
    )
  }
}

