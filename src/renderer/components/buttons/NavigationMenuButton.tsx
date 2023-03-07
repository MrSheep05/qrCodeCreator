import MenuIcon from '@mui/icons-material/Menu';
import { IconButton } from '@mui/material';

const NavigationMenuButton = () => {
  return (
    <IconButton
      aria-describedby="colorPick"
      size="small"
      sx={{ marginLeft: 'auto' }}
    >
      <MenuIcon />
    </IconButton>
  );
};

export default NavigationMenuButton;
