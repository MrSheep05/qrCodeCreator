import { inputEventFn } from 'renderer/utils';
import { IconButton } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';

const FileButton = ({ fn }: { fn: () => void }) => {
  return (
    <IconButton size="small" onClick={fn}>
      <ImageIcon />
    </IconButton>
  );
};

export default FileButton;
