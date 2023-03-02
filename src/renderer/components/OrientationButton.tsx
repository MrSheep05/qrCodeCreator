import { IconButton } from '@mui/material';
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
    <IconButton size="small" onClick={fn} disabled={isDisabled}>
      {type === 'horizontal' ? <CropLandscapeIcon /> : <CropPortraitIcon />}
    </IconButton>
  );
};

export default OrientationButton;
