export type inputEventFn = ({ target }: { target: HTMLInputElement }) => void;
export type MouseDimension = { mouseX: number; mouseY: number } | null;

type Props = {
  mouseContext: MouseDimension;
  setMouseContext: React.Dispatch<React.SetStateAction<MouseDimension>>;
};

export const contextMenuEventProvider = ({
  setMouseContext,
  mouseContext,
}: Props) => {
  return (event: React.MouseEvent) => {
    event.preventDefault();
    setMouseContext(
      mouseContext === null
        ? { mouseX: event.clientX + 2, mouseY: event.clientY - 6 }
        : null
    );
  };
};

export const draggingOverStyle = (isOver: boolean): React.CSSProperties => {
  return isOver
    ? { backgroundColor: '#b8bab980' }
    : { backgroundColor: 'unset' };
};

export const familyFonts = [
  { label: 'Andale Mono', value: 'andale mono,times' },
  { label: 'Arial', value: 'arial,helvetica,sans-serif' },
  { label: 'Arial Black', value: 'arial black,avant garde' },
  { label: 'Book Antiqua', value: 'book antiqua,palatino' },
  { label: 'Comic Sans MS', value: 'comic sans ms,sans-serif' },
  { label: 'Courier New', value: 'courier new,courier' },
  { label: 'Georgia', value: 'georgia,palatino' },
  { label: 'Helvetica', value: 'helvetica' },
  { label: 'Impact', value: 'impact,chicago' },
  { label: 'Symbol', value: 'symbol' },
  { label: 'Tahoma', value: 'tahoma,arial,helvetica,sans-serif' },
  { label: 'Terminal', value: 'terminal,monaco' },
  { label: 'Times New Roman', value: 'times new roman,times' },
  { label: 'Trebuchet MS', value: 'trebuchet ms,geneva' },
  { label: 'Verdana', value: 'verdana,geneva' },
  { label: 'Webdings', value: 'webdings' },
  { label: 'Wingdings', value: 'wingdings,zapf dingbats' },
];
