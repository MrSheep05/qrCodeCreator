import { IconButton, Popover } from '@mui/material';
import { useState, useContext } from 'react';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import { AppState } from 'renderer/utils/AppStateComponent';

const AspectRatioButton = () => {
  const { state, dispatch } = useContext(AppState);
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [anchorPopover, setAnchorPopover] = useState<any>();

  const applyNumber = (
    { target }: { target: HTMLInputElement },
    index: 0 | 1
  ) => {
    const regex = /\b[1-2]?\d{1}\b/gm;
    if (regex.test(target.value)) {
      const value = parseInt(target.value);
      console.log('przeszlo');
      if (value >= 20 || typeof value !== 'number') {
        target.value = '20';
      }

      const newRatio = state.selectedRatio.split(':');

      newRatio[index] = target.value;
      dispatch({ type: 'setRatio', payload: newRatio.join(':') });
      return;
    }
    target.value = '';
  };

  return (
    <div>
      <IconButton
        size="small"
        aria-describedby="ratioPrompt"
        onClick={({ target }) => {
          setIsOpened(true);
          setAnchorPopover(target);
        }}
      >
        <AspectRatioIcon />
      </IconButton>
      <Popover
        anchorEl={anchorPopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={isOpened}
        id="ratioPrompt"
        onClose={() => setIsOpened(false)}
      >
        <div>
          <input
            type="number"
            defaultValue={state.selectedRatio.split(':')[0]}
            onChange={(event) => applyNumber(event, 0)}
          ></input>
          :
          <input
            type="number"
            defaultValue={state.selectedRatio.split(':')[1]}
            onChange={(event) => applyNumber(event, 1)}
          ></input>
        </div>
      </Popover>
    </div>
  );
};

export default AspectRatioButton;
