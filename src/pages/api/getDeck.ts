import type { NextApiRequest, NextApiResponse } from 'next'


type Data = {
  response: JSON
}

export default async function getDeck(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const response = await fetch(`https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`);
    const deck = await response.json();
    res.status(200).json(deck);
  } catch (error: any) {
    res.status(400).json({response: error.message})
  }
}