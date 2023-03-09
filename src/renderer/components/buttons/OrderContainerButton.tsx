import { MoreHoriz, MoreVert } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { useContext } from 'react';
import { AppState } from 'renderer/utils/AppStateComponent';
import OrderContainer from '../OrderContainer';

function OrderContainerButton({ isHorizontal }: { isHorizontal: boolean }) {
  const { state, dispatch } = useContext(AppState);
  return (
    <Tooltip title={`Wstaw ${isHorizontal ? 'kolumnę' : 'wiersz'}`}>
      <IconButton
        size="small"
        onClick={() => {
          const { index } = state;
          dispatch({
            type: 'appendColumn',
            payload: (
              <OrderContainer index={index} isHorizontal={isHorizontal} />
            ),
          });
        }}
      >
        {isHorizontal ? <MoreVert /> : <MoreHoriz />}
      </IconButton>
    </Tooltip>
  );
}

export default OrderContainerButton;
