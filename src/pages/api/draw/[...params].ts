import type { NextApiRequest, NextApiResponse } from 'next'


type Data = {
  response: JSON
}

export default async function drawCard(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.query.params) {
    try {
      const deckid = req.query.params[0];
      const count = req.query.params[1]
      console.log(deckid)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${deckid}/draw/?count=${count}`);
      const cards = await response.json();
      res.status(200).json(cards);
      // TODO: check if deck is empty
  
    } catch (error: any) {
      res.status(400).json({ response: error.message })
    }
  }
}