import type { NextApiRequest, NextApiResponse } from 'next'


type Data = {
  response: JSON
}

export default async function addToDiscardPile(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.query.discard) {
    try {
      const deckid = req.query.discard[0];
      const card = req.query.discard[1];
      const response = await fetch(`https://www.deckofcardsapi.com/api/deck/${deckid}/pile/discard/add/?cards=${card}`);
      const deck = await response.json();
      res.status(200).json(deck);
    } catch (error: any) {
      res.status(400).json({ response: error.message })
    }
  }

}

 