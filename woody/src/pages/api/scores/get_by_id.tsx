import { NextApiRequest, NextApiResponse } from 'next';
import { scoresRepo } from '../../../utils/database';

const handler = (_req: NextApiRequest, res: NextApiResponse): void => {
  try {
    return res.status(200).json(scoresRepo.getById(parseInt(_req.query.id as string)));
  } catch (err: any) {
    return res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
