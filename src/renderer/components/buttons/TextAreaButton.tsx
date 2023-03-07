import { IconButton, Tooltip } from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { useContext } from 'react';
import { AppState } from 'renderer/utils/AppStateComponent';
import TextArea from '../TextArea';

const TextFieldButton = () => {
  const { state, dispatch } = useContext(AppState);

  return (
    <Tooltip title="Pole tekstowe">
      <IconButton
        size="small"
        onClick={() => {
          const index = state.index;
          dispatch({
            type: 'appendChild',
            payload: <TextArea key={index} index={index} />,
          });
        }}
      >
        <TextFieldsIcon />
      </IconButton>
    </Tooltip>
  );
};

export default TextFieldButton;
