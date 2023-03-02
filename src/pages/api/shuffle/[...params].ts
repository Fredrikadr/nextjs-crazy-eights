import type { NextApiRequest, NextApiResponse } from 'next'


type Data = {
  response: JSON
}

export default async function shuffleCards(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.query.params) {
    try {
      const deckid = req.query.params[0];
      const topCard = req.query.params[1]
      console.log(deckid)
      //Draw top card from discard pile
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${deckid}/pile/discard/draw/?cards=${topCard}`);

      //Return discard pile to main deck
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${deckid}/pile/discard/return/`);

      //Add top card back to discard pile
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${deckid}/pile/discard/add/?cards=${topCard}`)

      res.status(200).end();

    } catch (error: any) {
      res.status(400).json({ response: error.message })
    }
  }
}