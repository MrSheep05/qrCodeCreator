import { MenuItem, Slider } from '@mui/material';
import QRCode from 'qrcode';
import { useState, useEffect, useRef } from 'react';
import { MouseDimension, contextMenuEventProvider } from 'renderer/utils';
import ContextMenu from './ContextMenu';

type Style = {
  size: number;
  fontSize: number;
};

const QRContainer = ({ value, index }: { value: string; index: number }) => {
  const [style, setStyle] = useState<Style>({ size: 10, fontSize: 8 });
  const canvas = useRef<HTMLCanvasElement>(null);
  const [mouseContext, setMouseContext] = useState<MouseDimension>(null);

  useEffect(() => {
    QRCode.toCanvas(canvas.current, value, { margin: 1 });
  }, []);

  return (
    <div
      onContextMenu={contextMenuEventProvider({
        mouseContext,
        setMouseContext,
      })}
      style={{
        height: `${style.size}vmin`,
        width: `${style.size}vmin`,
        fontSize: `${style.fontSize}px`,
        textAlign: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        margin: 0,
      }}
    >
      <canvas
        style={{ height: `${style.size}vmin`, width: `${style.size}vmin` }}
        ref={canvas}
      ></canvas>
      <span>{value}</span>
      <ContextMenu
        mouseContext={mouseContext}
        setMouseContext={setMouseContext}
        index={index}
      >
        <MenuItem sx={{ display: 'flex', flexDirection: 'column' }}>
          Rozmiar{' '}
          <Slider
            defaultValue={10}
            min={5}
            max={80}
            step={1}
            onChange={(_, value) => {
              setStyle({ ...style, size: value as number });
            }}
          />
        </MenuItem>
        <MenuItem sx={{ display: 'flex', flexDirection: 'column' }}>
          Rozmiar czcionki{' '}
          <Slider
            defaultValue={8}
            min={5}
            max={20}
            step={1}
            onChange={(_, value) => {
              setStyle({ ...style, fontSize: value as number });
            }}
          />
        </MenuItem>
      </ContextMenu>
    </div>
  );
};
export default QRContainer;
