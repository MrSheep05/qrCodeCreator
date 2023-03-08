import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
} from '@mui/material';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import { useState } from 'react';

type Props = {
  cardView: React.RefObject<HTMLDivElement>;
};

const CreateTemplateButton = ({ cardView }: Props) => {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');

  const saveToHtml = async () => {
    const html = document.querySelector('html')!;
    html.querySelectorAll('header').forEach((node) => node.remove());
    html.querySelector("div[role='presentation']")?.remove();
    const response = await window.electron.ipcRenderer.invoke('createFile', {
      content: html.outerHTML,
      fileName,
    });
  };

  return (
    <div>
      <Tooltip title="Dodaj szablon">
        <IconButton
          aria-describedby="colorPick"
          size="small"
          onClick={() => {
            setIsOpened(true);
          }}
        >
          <AddToPhotosIcon />
        </IconButton>
      </Tooltip>
      <Dialog open={isOpened} onClose={() => setIsOpened(false)} id="dialog">
        <DialogTitle>Stwórz szablon</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Zapisując szablon, z obecnego wyglądu tworzysz wzór. Szablon
            umożliwia podmienienie danych znajdujących się w [].
          </DialogContentText>
          <TextField
            label="Nazwa pliku"
            value={fileName}
            margin="dense"
            autoFocus
            type="text"
            fullWidth
            variant="standard"
            onChange={({ target }) => {
              setFileName(target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setIsOpened(false);
            }}
          >
            Wstecz
          </Button>
          <Button
            onClick={async () => {
              setIsOpened(false);
              const isSuccess = await saveToHtml();
              // if (isSuccess) {
              // }
              window.electron.ipcRenderer.sendMessage('reload', []);
            }}
          >
            Zapisz
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateTemplateButton;
