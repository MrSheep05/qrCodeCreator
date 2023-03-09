import { height } from '@mui/system';
import { Editor } from '@tinymce/tinymce-react';
import { Resizable } from 're-resizable';
import { useRef, useState } from 'react';
import useResizing from 'renderer/hooks/useResizing';
import { MouseDimension, contextMenuEventProvider } from 'renderer/utils';
import ContextMenu from './ContextMenu';

type Props = {
  index: number;
};
function TextArea({ index }: Props) {
  const editorRef = useRef<any>(null);
  const holder = useRef<any>(null);
  const [mouseContext, setMouseContext] = useState<MouseDimension>(null);
  const [style, setStyle] = useState<{ width: number; height: number }>({
    width: 100,
    height: 84,
  });
  const [resizingStyle, setResizing] = useResizing();

  return (
    <div
      style={{ padding: 0, margin: 0 }}
      onContextMenu={contextMenuEventProvider({
        mouseContext,
        setMouseContext,
      })}
      className="placeholder"
    >
      <Resizable
        style={resizingStyle}
        onResizeStart={(e) => {
          e.stopPropagation();
          setResizing(true);
        }}
        onResizeStop={(_, __, ___, delta) => {
          setStyle({
            width: style.width + delta.width,
            height: style.height + delta.height,
          });
          setResizing(false);
        }}
        ref={holder}
        defaultSize={{ width: 100, height: 100 }}
      >
        <div style={{ ...style, marginBottom: 16 }}>
          <Editor
            id={`${index}`}
            onInit={(event, editor) => {
              editorRef.current = editor;
            }}
            init={{
              id: `${index}`,
              toolbar: false,
              menubar: false,
              statusbar: false,
              height: '100%',
              width: '100%',
              skin: 'borderless',
              inline: true,
            }}
            apiKey="w1oqeoai6gzdzrggfs57eka5qds7sqi4am42b1o8392qgrrx"
          />
        </div>
      </Resizable>
      <ContextMenu
        mouseContext={mouseContext}
        setMouseContext={setMouseContext}
        index={index}
      />
    </div>
  );
}

export default TextArea;
