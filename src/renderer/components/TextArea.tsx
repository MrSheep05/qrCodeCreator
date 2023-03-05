import { useContext, useEffect, useRef } from 'react';
import { AppState } from 'renderer/utils/AppStateComponent';

type Props = {
  editable: number;
  quillEditorContainer: React.RefObject<HTMLDivElement>;
  onChangeActive: ({
    editable,
    active,
  }: {
    active: boolean;
    editable: number;
    content: string;
  }) => void;
};
const TextArea = ({
  quillEditorContainer,
  onChangeActive,
  editable,
}: Props) => {
  const contentEl = useRef<HTMLDivElement>(null);

  const quillEditorParent = useRef<HTMLDivElement>(null);
  const { state } = useContext(AppState);
  const isActive = state.activeEditable === editable;

  useEffect(() => {
    contentEl.current!.innerHTML = state.quillContent[editable];
  }, [state.quillContent[editable]]);

  useEffect(() => {
    if (isActive)
      quillEditorParent.current!.appendChild(quillEditorContainer.current!);

    quillEditorParent.current!.style.display = isActive ? 'block' : 'none';
    contentEl.current!.style.display = isActive ? 'none' : 'block';
  }, [quillEditorParent, quillEditorContainer, isActive]);

  useEffect(() => {
    if (isActive) {
      const onKeyUp = (event: KeyboardEvent) => {
        if (event.code === 'Escape') {
          activate(false);
        }
      };

      document.addEventListener('keyup', onKeyUp);
      return () => document.removeEventListener('keyup', onKeyUp);
    }
  }, [isActive]);

  const activate = (active: boolean) => {
    onChangeActive({ editable, active, content: state.quillContent[editable] });
  };

  return (
    <div
      className="editable"
      id={`${editable}`}
      style={{
        position: 'relative',
        flexGrow: 1,
        flexBasis: 0,
        width: 0,
      }}
      onDoubleClick={() => activate(true)}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          display: 'none',
        }}
        ref={quillEditorParent}
      ></div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          padding: '2rem',
        }}
        ref={contentEl}
      ></div>
    </div>
  );
};

export default TextArea;
