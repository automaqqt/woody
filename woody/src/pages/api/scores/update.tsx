import { Score } from '@/interfaces/user';
import { NextApiRequest, NextApiResponse } from 'next';
import { scoresRepo } from '../../../utils/database';

export default function updatePost(
  req: NextApiRequest,
  res: NextApiResponse
): void {
  const rep = req.body.newScore;
  if (!scoresRepo.find((x: Score) => x.id === Number(rep.id)))
    throw `Score with ID  "${rep.id}" does not exist`;

  const success = scoresRepo.update(rep.id, rep);
  return res.status(200).json({success:success});
}
