import { Card } from '@mui/material';
import { useContext } from 'react';
import useRatio from 'renderer/hooks/useRatio';
import { AppState } from 'renderer/utils/AppStateComponent';
type props = {
  orientation: Boolean;
  color: string;
};
const CardView = ({ orientation, color }: props) => {
  const [width, height] = useRatio(orientation);
  const { state } = useContext(AppState);
  return (
    <Card
      sx={{
        height,
        width,
        borderRadius: '1rem',
        backgroundColor: color,
        display: 'flex',
        flexDirection: orientation ? 'row' : 'column',
        alignItems: 'center',
        justifyItems: 'center',
      }}
      variant="outlined"
    >
      {state.children
        ? Object.keys(state.children).map((key) => state.children[key])
        : undefined}
    </Card>
  );
};

export default CardView;
