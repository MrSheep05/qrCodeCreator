import { Editor } from '@tinymce/tinymce-react';
import { Resizable } from 're-resizable';
import { useRef, useState } from 'react';

type Props = {
  fn: React.Dispatch<React.SetStateAction<number | undefined>>;
  index: number;
};
const TextArea = ({ fn, index }: Props) => {
  const editorRef = useRef<any>(null);
  const [style, setStyle] = useState<{ width: number; height: number }>({
    width: 100,
    height: 100,
  });
  return (
    <div style={{ height: style.height, width: style.width }}>
      <Resizable
        onResizeStop={(_, __, ___, delta) => {
          setStyle({
            width: style.width + delta.width,
            height: style.height + delta.height,
          });
        }}
        defaultSize={{ width: 100, height: 100 }}
        className="placeholder"
      >
        <Editor
          onInit={(event, editor) => (editorRef.current = editor)}
          init={{
            toolbar: false,
            menubar: false,
            statusbar: false,
            suffix: '.min',
            height: '100%',
            width: '100%',
            resize: 'both',
            inline_boundaries: false,
            skin: 'borderless',
          }}
          apiKey="w1oqeoai6gzdzrggfs57eka5qds7sqi4am42b1o8392qgrrx"
          onClick={() => {
            fn(index);
          }}
        ></Editor>
      </Resizable>
    </div>
  );
};

export default TextArea;
