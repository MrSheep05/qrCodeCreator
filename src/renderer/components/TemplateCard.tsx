import {
  Card,
  CardActions,
  CardContent,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import html2canvas from 'html2canvas';
import { useEffect, useRef } from 'react';
import { Download, NoteAdd, Clear } from '@mui/icons-material';

type Props = {
  fileName: string;
  content: string;
  prepareElement: HTMLDivElement;
};
const TemplateCard = ({ fileName, content, prepareElement }: Props) => {
  const preview = useRef<HTMLDivElement>(null);

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
          <IconButton>
            <Clear color="error" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default TemplateCard;
