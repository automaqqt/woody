import { NextApiRequest, NextApiResponse } from 'next';
import { woodRepo } from '../../../utils/database';

const handler = (_req: NextApiRequest, res: NextApiResponse): void => {
  try {
    return res.status(200).json(woodRepo.getAll());
  } catch (err: any) {
    return res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
