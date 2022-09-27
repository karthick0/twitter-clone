// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { TweetBody } from '../../typings'

type Data = {
  name: string
}

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const data:TweetBody = JSON.parse(req.body);
  
  const mutations = {
    mutations: [{
      create: {
        _type: 'tweet',
        text: data.text,
        username: data.username,
        blockTweet: false,
        profileImage: data.profileImage,
        image: data.image,
      }
    }]
  }

  const apiEndPoint = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-06-07/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`;

  const response = await fetch(apiEndPoint,{
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${process.env.SANITY_API_TOKEN}`
    },
    body: JSON.stringify(mutations),
    method: 'POST'
  })

  const json = await response.json();
  // console.log(json)

  res.status(200).json({ name: 'John Doe' })
}
