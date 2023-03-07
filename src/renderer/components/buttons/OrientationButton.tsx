import { IconButton, Tooltip } from '@mui/material';
import CropLandscapeIcon from '@mui/icons-material/CropLandscape';
import CropPortraitIcon from '@mui/icons-material/CropPortrait';

const OrientationButton = ({
  fn,
  isDisabled,
  type,
}: {
  fn: () => void;
  isDisabled: boolean;
  type: 'horizontal' | 'vertical';
}) => {
  return (
    <Tooltip title={type === 'horizontal' ? 'Poziomo' : 'Pionowo'}>
      <div>
        <IconButton size="small" onClick={fn} disabled={isDisabled}>
          {type === 'horizontal' ? <CropLandscapeIcon /> : <CropPortraitIcon />}
        </IconButton>
      </div>
    </Tooltip>
  );
};

export default OrientationButton;
