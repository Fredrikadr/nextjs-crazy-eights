import { Component } from "react";

let newDeck = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";

export default class Board extends Component {
  constructor(props: any) {
    super(props)
    this.state = {
      currentPlayer: "playerHand",
      deckId: null,
      deck: {},
      playerHand: [],
      computerHand: []
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

  async drawCard(deckId: string, currentPlayer: string) {
    let { playerHand }: any = this.state;
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
    const data = await response.json();
    
    this.setState({
      [currentPlayer]: [data.cards[0].code]
    })
    return data.cards.code;
  }

  getPlayerDeck() {

  }

  getComputerDeck() {

  }

  async componentDidMount() {
    let { deckId }: any = this.state;
    if (!deckId) {
      await this.fetchDeck();
    }
    console.log("mounted")
  }


  render() {
    console.log(this.state)
    let { deckId, currentPlayer}: any = this.state;


    return (
      <>
        <h1>Crazy Eights</h1>
        <button onClick={async () => { await this.drawCard(deckId, currentPlayer) }}>Draw Card</button>

      </>
    )
  }
}

