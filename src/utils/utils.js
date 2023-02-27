
async function fetchDeckId() {
  const response = await fetch(`/api/getDeck`);
  const deck = await response.json()
  return deck.deck_id;
}

export { fetchDeckId };