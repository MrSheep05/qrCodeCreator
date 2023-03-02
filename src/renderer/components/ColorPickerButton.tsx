import { IconButton, Popover } from '@mui/material';
import BrushIcon from '@mui/icons-material/Brush';
import { useState, useRef } from 'react';
import { inputEventFn } from 'renderer/utils';

const ColorPickerButton = ({ fn }: { fn: inputEventFn }) => {
  const [anchorPopover, setAnchorPopover] = useState<any>();
  const [isOpened, setIsOpened] = useState<boolean>(false);

  return (
    <div>
      <IconButton
        aria-describedby="colorPick"
        size="small"
        onClick={({ target }) => {
          setIsOpened(true);
          setAnchorPopover(target);
        }}
      >
        <BrushIcon />
      </IconButton>
      <Popover
        anchorEl={anchorPopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={isOpened}
        id="colorPick"
        onClose={() => setIsOpened(false)}
      >
        <input type="color" defaultValue="#ffffff" onChange={fn} />
      </Popover>
    </div>
  );
};

export default ColorPickerButton;
