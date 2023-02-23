import { Component } from "react";

let newDeck = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";

export default class Board extends Component {
  constructor(props:any) {
    super(props)
    this.state = {
      deckId: null,
      deck: {},
      playerHand: {},
      computerHand: {}
    }
  }

  async fetchDeck() {
    const response = await fetch(`${newDeck}`);
    const deck = await response.json();
    const { deck_id, remaining, success } = deck;
    console.log("fetching")

    this.setState({
      deckId: deck_id,

    });

    return deck; 
  }

  shuffleDeck() {

  }


  addToPile() {

  }

  drawCard() {

  }

  getPlayerDeck() {

  }

  getComputerDeck() {

  }

  async componentDidMount() {
    await this.fetchDeck();
    let { deckId } : any = this.state;
    console.log(deckId)
    console.log("mounted")
  }


  render() {
    return (
      <h1>Crazy Eights</h1>
    )
  }
}

