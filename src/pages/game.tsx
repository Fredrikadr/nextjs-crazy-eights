import Board from '@/components/Board'


export async function getServerSideProps() {
  const response = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
  const data = await response.json();
  let id = data.deck_id
  return {
    props: {
    deckid: id
  }
}
}

export default function Home({deckid}: {deckid: string}) {
  return (
    <>
      <header></header>
      <Board deckId={deckid} />
    </>
  )
}
