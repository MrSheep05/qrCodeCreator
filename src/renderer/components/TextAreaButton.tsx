import { IconButton, TextareaAutosize } from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { Children, useContext } from 'react';
import { AppState } from 'renderer/utils/AppStateComponent';

const TextFieldButton = () => {
  const { state, dispatch } = useContext(AppState);

  return (
    <IconButton
      size="small"
      onClick={() => {
        dispatch({
          type: 'appendChild',
          payload: (
            <TextareaAutosize
              key={Children.count(state.children)}
              onChange={({ target }) => {
                target.innerHTML = JSON.stringify(target.value);
              }}
              onContextMenu={() => {
                console.log('a');
              }}
            ></TextareaAutosize>
          ),
        });
      }}
    >
      <TextFieldsIcon />
    </IconButton>
  );
};

export default TextFieldButton;
