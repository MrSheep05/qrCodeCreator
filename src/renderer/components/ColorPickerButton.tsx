import { IconButton, Popover, Tooltip } from '@mui/material';
import { useRef, useState } from 'react';
import { inputEventFn } from 'renderer/utils';

type Props = {
  fn: inputEventFn;
  title: string;
  children: JSX.Element;
  defaultValue?: string;
};
const ColorPickerButton: React.FC<Props> = ({
  fn,
  title,
  children,
  defaultValue = '#ffffff',
}) => {
  const anchorPopover = useRef(null);
  const [isOpened, setIsOpened] = useState<boolean>(false);

  return (
    <div>
      <Tooltip title={title}>
        <IconButton
          aria-describedby={`title${title}`}
          size="small"
          ref={anchorPopover}
          onClick={() => {
            setIsOpened(true);
          }}
        >
          {children}
        </IconButton>
      </Tooltip>
      <Popover
        anchorEl={anchorPopover.current}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={isOpened}
        id={`title${title}`}
        onClose={() => setIsOpened(false)}
      >
        <input type="color" defaultValue={defaultValue} onChange={fn} />
      </Popover>
    </div>
  );
};

export default ColorPickerButton;
