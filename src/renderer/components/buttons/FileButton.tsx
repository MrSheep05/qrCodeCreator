import { IconButton, Tooltip } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import { useContext, useRef } from 'react';
import { AppState } from 'renderer/utils/AppStateComponent';
import ImageContainer from '../ImageContainer';

function FileButton() {
  const { dispatch, state } = useContext(AppState);
  const fileInput = useRef<HTMLInputElement>(null);
  const imageTypes = ['image/gif', 'image/jpeg', 'image/png'];
  const fileButtonFn = () => {
    if (fileInput.current) {
      fileInput.current.click();
    }
  };

  return (
    <div>
      <input
        type="file"
        style={{ display: 'none' }}
        ref={fileInput}
        onChange={({ target }) => {
          if (target.files) {
            const checkedTypes = [...target.files].filter((file) =>
              imageTypes.includes(file.type)
            );
            target.value = '';
            const { index } = state;

            dispatch({
              type: 'appendChild',
              payload: <ImageContainer image={checkedTypes[0]} index={index} />,
            });
          }
        }}
      />

      <Tooltip title="Wstaw obraz">
        <div>
          <IconButton size="small" onClick={fileButtonFn}>
            <ImageIcon />
          </IconButton>
        </div>
      </Tooltip>
    </div>
  );
}

export default FileButton;
