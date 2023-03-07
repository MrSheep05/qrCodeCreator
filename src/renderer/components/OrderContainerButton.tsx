import { MoreHoriz, MoreVert } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

const OrderContainerButton = ({ isHorizontal }: { isHorizontal: boolean }) => {
  return (
    <Tooltip title={`Wstaw ${isHorizontal ? 'kolumnę' : 'wiersz'}`}>
      <IconButton size="small">
        {isHorizontal ? <MoreVert /> : <MoreHoriz />}
      </IconButton>
    </Tooltip>
  );
};

export default OrderContainerButton;
