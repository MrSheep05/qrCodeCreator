import { MenuItem } from '@mui/material';
import { Resizable } from 're-resizable';
import { useState } from 'react';
import useResizing from 'renderer/hooks/useResizing';
import { MouseDimension, contextMenuEventProvider } from 'renderer/utils';
import ContextMenu from './ContextMenu';

function Placeholder({ index }: { index: number }) {
  const deafult = { width: 100, height: 100 };
  const [style, setStyle] = useState<{
    width: number;
    height: number;
    backgroundColor: string;
  }>({ ...deafult, backgroundColor: '#ffffff' });
  const [resizingStyle, setResizing] = useResizing();
  const [mouseContext, setMouseContext] = useState<MouseDimension>(null);

  return (
    <div
      className="placeholder"
      onContextMenu={contextMenuEventProvider({
        mouseContext,
        setMouseContext,
      })}
    >
      <Resizable
        defaultSize={deafult}
        onResizeStart={(e) => {
          e.stopPropagation();
          setResizing(true);
        }}
        onResizeStop={(_, __, ___, delta) => {
          setResizing(false);
          setStyle({
            ...style,
            width: style.width + delta.width,
            height: style.height + delta.height,
          });
        }}
        style={resizingStyle}
      >
        <div style={style} />
        <ContextMenu
          index={index}
          setMouseContext={setMouseContext}
          mouseContext={mouseContext}
        >
          <MenuItem sx={{ display: 'flex', flexDirection: 'column' }}>
            Kolor
            <input
              type="color"
              defaultValue="#ffffff"
              onChange={({ target }) =>
                setStyle({ ...style, backgroundColor: target.value })
              }
            />
          </MenuItem>
        </ContextMenu>
      </Resizable>
    </div>
  );
}

export default Placeholder;
