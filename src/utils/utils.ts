
async function fetchDeckId() {
  const response = await fetch(`/api/getDeck`);
  const deck = await response.json()
  return deck.deck_id;
}



async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { fetchDeckId, sleep };