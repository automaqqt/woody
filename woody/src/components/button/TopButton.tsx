import { Button } from '@mui/material';

export type BackButtonProps = {
  /** Text that will appear within the button */
  buttonText: string;

  /** Color */
  color?: string;

  /** Function to run on click */
  onClick: () => void;

  /** Function to run on click */
  alignRight?: boolean;
};

export default function TopSmallActionButton({
  onClick,
  buttonText,
  color="#287233",
  alignRight=false
}: BackButtonProps) {
  if (alignRight) return (
    <Button
      variant="contained"
      aria-label={buttonText}
      sx={{ float:'right', marginRight:2, backgroundColor: color }}
      onClick={onClick}
    >
      {buttonText}
    </Button>
  );
  else return (
    <Button
      variant="contained"
      aria-label={buttonText}
      sx={{ marginTop: 1, marginLeft: 2, marginBottom: -4, backgroundColor: color }}
      onClick={onClick}
    >
      {buttonText}
    </Button>
  );
}