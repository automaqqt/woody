import { Score } from '@/interfaces/user';
import { NextApiRequest, NextApiResponse } from 'next';
import { scoresRepo } from '../../../utils/database';

export default function createPost(
  req: NextApiRequest,
  res: NextApiResponse
): void {
  const score = scoresRepo.create(req.body);
  return res.status(200).json({data:score});
}
