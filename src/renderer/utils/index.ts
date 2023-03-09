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
