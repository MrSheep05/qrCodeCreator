import { IconButton, Tooltip } from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { useContext } from 'react';
import { AppState } from 'renderer/utils/AppStateComponent';
import TextArea from './TextArea';
type Props = {
  fn: React.Dispatch<React.SetStateAction<number | undefined>>;
};
const TextFieldButton = ({ fn }: Props) => {
  const { state, dispatch } = useContext(AppState);

  return (
    <Tooltip title="Pole tekstowe">
      <IconButton
        size="small"
        onClick={() => {
          const index = state.index;
          dispatch({
            type: 'appendChild',
            payload: <TextArea key={index} fn={fn} index={index} />,
          });
        }}
      >
        <TextFieldsIcon />
      </IconButton>
    </Tooltip>
  );
};

export default TextFieldButton;
