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
import html2canvas from 'html2canvas';

type Props = {
  cardView: React.RefObject<HTMLDivElement>;
};

function CreateTemplateButton({ cardView }: Props) {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const cloneRef = useRef<HTMLDivElement>(null);

  const toBase64 = (buffer: Buffer) => {
    return btoa(
      buffer.reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
  };

  const saveToHtml = async () => {
    const changeable = /\[[A-Z0-9]*\]/;
    const clone = document.querySelector('html')!.cloneNode(true);
    const html = cloneRef.current!;
    html.innerHTML = '';
    html.appendChild(clone);
    html.querySelectorAll('img').forEach((img) => {
      const image = document.createElement('img');
      if (changeable.test(img.title)) {
        image.src = `data:image/png;base64${img.title}`;
        image.style.width = img.style.width;
        image.style.height = img.style.height;
        img.replaceWith(image);
      } else {
        html2canvas(img, {
          allowTaint: true,
          useCORS: true,
        }).then((canvas) => {
          const url = canvas.toDataURL();
          const data = url.replace(/^data:image\/\w+;base64,/, '');
          const buffer = Buffer.from(data, 'base64');
          image.src = `data:image/png;base64 ${toBase64(buffer)}`;
          img.replaceWith(image);
        });
      }
    });

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
                window.electron.ipcRenderer.invoke('reload');
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
function toBase64() {
  throw new Error('Function not implemented.');
}
