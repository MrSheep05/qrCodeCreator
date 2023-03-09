import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppState } from 'renderer/utils/AppStateComponent';

function NavigationMenuButton() {
  const [anchorPopover, setAnchorPopover] = useState<any>();
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const { state, dispatch } = useContext(AppState);
  const navigate = useNavigate();
  return (
    <div style={{ marginLeft: 'auto' }}>
      <IconButton
        aria-describedby="colorPick"
        size="small"
        onClick={({ target }) => {
          setAnchorPopover(target);
          setIsOpened(true);
        }}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        open={isOpened}
        anchorEl={anchorPopover}
        onClose={() => setIsOpened(false)}
      >
        <MenuItem
          disabled={state.location === ''}
          onClick={() => {
            navigate('/');
            dispatch({ type: 'setLocation', payload: '' });
          }}
        >
          Kreator
        </MenuItem>
        <MenuItem
          disabled={state.location === 'templates'}
          onClick={() => {
            navigate('/templates');
            dispatch({ type: 'setLocation', payload: 'templates' });
          }}
        >
          Szablony
        </MenuItem>
      </Menu>
    </div>
  );
}

export default NavigationMenuButton;
