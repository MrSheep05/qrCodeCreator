import { Menu, MenuItem } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useContext } from 'react';
import { AppState } from 'renderer/utils/AppStateComponent';
import { MouseDimension } from 'renderer/utils';

type Props = {
  index: number;
  children: JSX.Element | JSX.Element[];
  mouseContext: MouseDimension;
  setMouseContext: React.Dispatch<React.SetStateAction<MouseDimension>>;
};

const ContextMenu: React.FC<Props> = ({
  index,
  children,
  mouseContext,
  setMouseContext,
}) => {
  const { dispatch } = useContext(AppState);
  return (
    <Menu
      onClose={() => setMouseContext(null)}
      open={mouseContext !== null}
      anchorReference="anchorPosition"
      anchorPosition={
        mouseContext !== null
          ? { top: mouseContext.mouseY, left: mouseContext.mouseX }
          : undefined
      }
    >
      {children}
      <MenuItem
        sx={{ justifyContent: 'center' }}
        onClick={() => {
          dispatch({ type: 'removeChild', payload: index });
          setMouseContext(null);
        }}
      >
        Usuń
        <ClearIcon sx={{ color: 'red' }} />
      </MenuItem>
    </Menu>
  );
};

export default ContextMenu;
