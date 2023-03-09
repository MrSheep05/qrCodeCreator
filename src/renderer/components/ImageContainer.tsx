import { MenuItem, TextField, Tooltip } from '@mui/material';
import { Resizable } from 're-resizable';
import { useContext, useEffect, useState } from 'react';
import useResizing from 'renderer/hooks/useResizing';
import { MouseDimension, contextMenuEventProvider } from 'renderer/utils';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import { Draggable } from 'react-beautiful-dnd';
import { AppState } from 'renderer/utils/AppStateComponent';
import ContextMenu from './ContextMenu';
import DraggableWrapper from './DraggableWrapper';

type Props = {
  image: File;
  index: number;
};
function ImageContainer({ image, index }: Props) {
  const [size, setSize] = useState<{ width: number; height: number }>();
  const [mouseContext, setMouseContext] = useState<MouseDimension>(null);
  const [resizingStyle, setIsResizing] = useResizing();
  const [imgId, setImgId] = useState<string>('');
  const { state } = useContext(AppState);

  useEffect(() => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(image);
    img.onload = () => {
      setSize({ width: 200, height: (img.height / img.width) * 200 });
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  }, []);

  return (
    <div
      style={{ ...size }}
      onContextMenu={contextMenuEventProvider({
        mouseContext,
        setMouseContext,
      })}
    >
      <Resizable
        style={resizingStyle}
        onResizeStart={(e) => {
          e.stopPropagation();
          setIsResizing(true);
        }}
        onResizeStop={(_, __, ___, delta) => {
          setSize({
            width: size!.width + delta.width,
            height: size!.height + delta.height,
          });
          setIsResizing(false);
        }}
      >
        <img src={URL.createObjectURL(image)} style={size} title={`${imgId}`} />
      </Resizable>
      <ContextMenu
        index={index}
        mouseContext={mouseContext}
        setMouseContext={setMouseContext}
      >
        <Tooltip title="ID używane w szablonie">
          <MenuItem
            sx={{
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <TextField
              title="ID"
              placeholder="[ID]"
              onChange={({ target }) => setImgId(target.value)}
            />
            <FingerprintIcon />
          </MenuItem>
        </Tooltip>
      </ContextMenu>
    </div>
  );
}

export default ImageContainer;
