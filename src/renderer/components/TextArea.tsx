import { Editor } from '@tinymce/tinymce-react';
import { Resizable } from 're-resizable';
import { useRef, useState } from 'react';
import { MouseDimension } from 'renderer/utils';
import ContextMenu from './ContextMenu';

type Props = {
  fn: React.Dispatch<React.SetStateAction<number | undefined>>;
  index: number;
};
const TextArea = ({ fn, index }: Props) => {
  const editorRef = useRef<any>(null);
  const holder = useRef<any>(null);
  const [mouseContext, setMouseContext] = useState<MouseDimension>(null);
  const [style, setStyle] = useState<{ width: number; height: number }>({
    width: 100,
    height: 100,
  });

  return (
    <div
      style={{ ...style, position: 'unset' }}
      onFocus={() => {
        fn(index);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      <Resizable
        onResizeStart={(e) => e.stopPropagation()}
        onResizeStop={(_, __, ___, delta) => {
          setStyle({
            width: style.width + delta.width,
            height: style.height + delta.height,
          });
        }}
        ref={holder}
        defaultSize={{ width: 100, height: 100 }}
      >
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
        ></Editor>
      </Resizable>
      <ContextMenu
        mouseContext={mouseContext}
        setMouseContext={setMouseContext}
        index={index}
      />
    </div>
  );
};

export default TextArea;
