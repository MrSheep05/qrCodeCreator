import ExpandIcon from '@mui/icons-material/Expand';
import { IconButton, Tooltip } from '@mui/material';
import { useContext } from 'react';
import { AppState } from 'renderer/utils/AppStateComponent';
import Placeholder from '../Placeholder';

const PlaceholderButton = () => {
  const { state, dispatch } = useContext(AppState);
  return (
    <Tooltip title="Wcięcie">
      <IconButton
        size="small"
        onClick={() => {
          const index = state.index;
          dispatch({
            type: 'appendChild',
            payload: <Placeholder key={index} index={index} />,
          });
        }}
      >
        <ExpandIcon />
      </IconButton>
    </Tooltip>
  );
};

export default PlaceholderButton;
