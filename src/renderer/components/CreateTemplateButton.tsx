import { IconButton, Tooltip } from '@mui/material';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
const CreateTemplateButton = () => {
  return (
    <Tooltip title="Dodaj szablon">
      <IconButton aria-describedby="colorPick" size="small">
        <AddToPhotosIcon />
      </IconButton>
    </Tooltip>
  );
};

export default CreateTemplateButton;
