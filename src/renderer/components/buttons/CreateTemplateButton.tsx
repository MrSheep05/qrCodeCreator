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
import { useRef, useState } from 'react';

type Props = {
  cardView: React.RefObject<HTMLDivElement>;
};

function CreateTemplateButton({ cardView }: Props) {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const cloneRef = useRef<HTMLDivElement>(null);

  const saveToHtml = async () => {
    const clone = document.querySelector('html')!.cloneNode(true);
    const html = cloneRef.current!;
    html.innerHTML = '';
    html.appendChild(clone);
    html.querySelectorAll('header').forEach((node) => node.remove());
    html.querySelector("div[role='presentation']")?.remove();
    const response = await window.electron.ipcRenderer.invoke('createFile', {
      content: html.querySelector('html')!.outerHTML,
      fileName,
    });

    return response;
  };

  return (
    <div>
      <div style={{ display: 'none' }} ref={cloneRef} />
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
              const isSuccess = await saveToHtml();
              if (isSuccess) {
                setIsOpened(false);
                window.electron.ipcRenderer.sendMessage('reload', []);
              }
            }}
          >
            Zapisz
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CreateTemplateButton;
