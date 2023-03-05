import { IconButton, TextareaAutosize, Tooltip } from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { useContext } from 'react';
import { AppState } from 'renderer/utils/AppStateComponent';
import TextArea from './TextArea';

type Props = {
  fn: ({
    active,
    editable,
  }: {
    active: boolean;
    editable: number;
    content: string;
  }) => void;
  quillEditor: React.RefObject<HTMLDivElement>;
};
const TextFieldButton = ({ fn, quillEditor }: Props) => {
  const { state, dispatch } = useContext(AppState);

  return (
    <Tooltip title="Pole tekstowe">
      <IconButton
        size="small"
        onClick={() => {
          const index = state.index;
          dispatch({
            type: 'addEditable',
            payload: (
              <TextArea
                editable={index}
                key={index}
                onChangeActive={fn}
                quillEditorContainer={quillEditor}
              />
            ),
          });
        }}
      >
        <TextFieldsIcon />
      </IconButton>
    </Tooltip>
  );
};

export default TextFieldButton;
