import {
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import html2canvas from 'html2canvas';
import { useEffect, useRef, useState } from 'react';
import { Download, NoteAdd, Clear } from '@mui/icons-material';

type Props = {
  fileName: string;
  content: string;
  prepareElement: HTMLDivElement;
};
const TemplateCard = ({ fileName, content, prepareElement }: Props) => {
  const preview = useRef<HTMLDivElement>(null);
  const [isOpened, setIsOpened] = useState<boolean>(false);

  useEffect(() => {
    prepareElement.innerHTML = content;
    const card = prepareElement.querySelector('#root')!;
    console.log(card);
    html2canvas(card as HTMLElement, { allowTaint: true, useCORS: true }).then(
      (canvas) => {
        preview.current!.innerHTML = '';
        canvas.style.height = '100%';
        canvas.style.width = '100%';
        canvas.className = 'templateCanvas';
        preview.current!.appendChild(canvas);
      }
    );
    prepareElement.innerHTML = '';
  }, [content]);

  return (
    <div>
      <Card
        style={{ height: '20vh', width: '25vw', margin: '1rem' }}
        className="templateView"
      >
        <CardContent className="templateArea">
          <Typography className="templateTitle">{fileName}</Typography>
          <div ref={preview}></div>
        </CardContent>
        <CardActions
          className="templateButtons"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'center',
            justifyContent: 'center',
            margin: 0,
          }}
        >
          <Tooltip title="Pobierz wzór" placement="left">
            <IconButton>
              <Download color="info" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Korespondencja" placement="left">
            <IconButton>
              <NoteAdd color="success" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Usuń wzór" placement="left">
            <IconButton
              onClick={() => {
                setIsOpened(true);
              }}
            >
              <Clear color="error" />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>
      <Dialog open={isOpened} onClose={() => setIsOpened(false)}>
        <DialogTitle>Usuwanie szablonu</DialogTitle>
        <DialogContent>
          <Typography>{`Czy na pewno chcesz usunąć ${fileName} szablon?`}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsOpened(false)}>Wstecz</Button>
          <Button
            onClick={async () => {
              const isSuccessed = await window.electron.ipcRenderer.invoke(
                'removeFile',
                fileName
              );
              setIsOpened(false);
              window.electron.ipcRenderer.invoke('reload');
            }}
          >
            Potwierdź
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TemplateCard;
