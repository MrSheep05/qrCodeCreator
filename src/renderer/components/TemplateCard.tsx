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
import QRCode from 'qrcode';
import { Buffer } from 'buffer';
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

  const createPng = async (
    response: {
      [key: string]: { [key: string]: string };
    },
    directionPath: string
  ) => {
    await Object.keys(response).forEach(async (row, index) => {
      prepareElement.innerHTML = content[fileName];
      const { width, height } = prepareElement.querySelector('canvas')!.style;
      Object.keys(response[row]).forEach((tag) => {
        const isNotQR = /\[[A-Z0-9]*\]/;
        const checkForQR = /<canvas.*/;

        if (isNotQR.test(tag)) {
          prepareElement.querySelectorAll('img').forEach((img) => {
            if (img.src.includes(tag)) {
              const image = document.createElement('img');
              const { width, height } = img.style;
              image.style.height = height;
              image.style.width = width;
              image.src = `data:image/png;base64, ${response[row][tag]}`;
              img.replaceWith(image);
            }
          });
          prepareElement.innerHTML = prepareElement.innerHTML.replace(
            tag,
            response[row][tag]
          );
        } else {
          if (checkForQR.test(content[fileName])) {
            prepareElement.querySelectorAll('canvas').forEach((canvas) => {
              const placeHolder = document.createElement('canvas');
              QRCode.toCanvas(placeHolder, response[row][tag], { margin: 1 });
              canvas.style.width = `${width}px`;
              canvas.style.height = `${height}px`;
              canvas.style.display = 'block';
              const url = placeHolder.toDataURL();
              const img = document.createElement('img');
              img.src = url;
              canvas.replaceWith(img);
            });
          }
        }
      });
      html2canvas(prepareElement.querySelector('#card') as HTMLElement, {
        allowTaint: true,
        useCORS: true,
      }).then((image) => {
        const url = image.toDataURL();
        const data = url.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(data, 'base64');
        window.electron.ipcRenderer.invoke('saveImage', {
          file: buffer,
          directionPath,
          index,
        });
      });
      prepareElement.innerHTML = '';
    });
  };

  useEffect(() => {
    prepareElement.innerHTML = content[fileName];
    const card = prepareElement.querySelector('#card')!;
    html2canvas(card as HTMLElement, { allowTaint: true, useCORS: true }).then(
      (canvas) => {
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
          <Tooltip title="Pobierz wz??r" placement="left">
            <IconButton
              onClick={() =>
                window.electron.ipcRenderer.invoke('createExcel', fileName)
              }
            >
              <Download color="info" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Korespondencja" placement="left">
            <IconButton
              onClick={async () => {
                const recived = await window.electron.ipcRenderer.invoke(
                  'makeFromTemplates',
                  fileName
                );
                if (recived) {
                  const { response, directionPath } = recived;
                  createPng(response, directionPath);
                }
              }}
            >
              <NoteAdd color="success" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Usu?? wz??r" placement="left">
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
          <Typography>{`Czy na pewno chcesz usun???? ${fileName} szablon?`}</Typography>
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
                setContent(content);
                templateCard.current!.remove();
              }
              setIsOpened(false);
            }}
          >
            Potwierd??
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TemplateCard;
