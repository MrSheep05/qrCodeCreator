import {
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
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
  content: { [key: string]: string };
  prepareElement: HTMLDivElement;
  setContent: React.Dispatch<
    React.SetStateAction<
      | {
          [key: string]: string;
        }
      | undefined
    >
  >;
};
const TemplateCard = ({
  fileName,
  content,
  prepareElement,
  setContent,
}: Props) => {
  const preview = useRef<HTMLDivElement>(null);
  const templateCard = useRef<HTMLDivElement>(null);
  const [isOpened, setIsOpened] = useState<boolean>(false);

  useEffect(() => {
    prepareElement.innerHTML = content[fileName];
    const card = prepareElement.querySelector('#card')!;
    html2canvas(card as HTMLElement, { allowTaint: true, useCORS: true }).then(
      (canvas) => {
        console.log(canvas.height, canvas.width);
        preview.current!.innerHTML = '';
        canvas.style.height = '100%';
        canvas.style.width = '100%';
        preview.current!.appendChild(canvas);
      }
    );
    prepareElement.innerHTML = '';
  }, [content]);

  return (
    <div ref={templateCard}>
      <Card
        style={{ height: '20vh', width: '25vw', margin: '1rem' }}
        className="templateView"
      >
        <CardContent className="templateArea">
          <Typography>{fileName}</Typography>
          <div ref={preview} style={{ width: '100%', height: '100%' }}></div>
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
            <IconButton
              onClick={() =>
                window.electron.ipcRenderer.invoke('createExcel', fileName)
              }
            >
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
              if (isSuccessed) {
                delete content[fileName];
                console.log(content);
                setContent(content);
                templateCard.current!.remove();
              }
              setIsOpened(false);
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
