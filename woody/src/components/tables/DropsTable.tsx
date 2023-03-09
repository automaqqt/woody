import { Score } from '@/interfaces/user';
import Button from '@mui/material/Button';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import humanizeDuration from "humanize-duration";
import useSWR from 'swr';
import TableTemplate from './TableTemplate';

function getTypeNamed(type: string) {
  if (type == "mining") {
    return "Raffle"
  }
  if (type == "targetmining") {
    return "Target mining"
  }
}
export default function DropsTable() {
  const { data: drops } = useSWR<Score[], Error>(
    ['/api/scores/all'],
    (url, options) => axios.get(url, options).then((res) => res.data),
    { refreshInterval: 60000, }
  );
  console.log(drops)
  let dropsToIter = drops;
  if (drops) {
    drops?.sort((a, b) => b.score - a.score);
    if (drops?.length > 100) {
      
      dropsToIter = drops.slice(0,100);
    }
    else {
      dropsToIter = drops;
    }
  }
  
  

  return (
    <>
      <TableTemplate
        names={['Score', 'Spieler', 'Mode', 'Zeit']}
        data={drops?.map((row, i) => (
          <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell>{row.score}</TableCell>
            <TableCell>{row.player_name}</TableCell>
            <TableCell>{row.mode}</TableCell>
            <TableCell>{humanizeDuration(row.time_passed_in_ms)}</TableCell>
            
          </TableRow>
        ))}
      />
    </>
  );
}
