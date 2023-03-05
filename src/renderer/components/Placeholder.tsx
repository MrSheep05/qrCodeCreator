import { MenuItem } from '@mui/material';
import { Resizable } from 're-resizable';
import { useState } from 'react';
import { MouseDimension, contextMenuEventProvider } from 'renderer/utils';
import ContextMenu from './ContextMenu';

const Placeholder = ({ index }: { index: number }) => {
  const deafult = { width: 100, height: 100 };
  const [style, setStyle] = useState<{
    width: number;
    height: number;
    backgroundColor: string;
  }>({ ...deafult, backgroundColor: '#ffffff' });

  const [mouseContext, setMouseContext] = useState<MouseDimension>(null);

  return (
    <div
      onContextMenu={contextMenuEventProvider({
        mouseContext,
        setMouseContext,
      })}
      style={{ backgroundColor: style.backgroundColor }}
    >
      <Resizable
        className="placeholder"
        defaultSize={deafult}
        onResize={(_, __, ___, delta) => {
          setStyle({ ...style, width: delta.width, height: delta.height });
        }}
      >
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
};

export default Placeholder;
