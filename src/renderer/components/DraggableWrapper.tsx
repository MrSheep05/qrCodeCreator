type Props = {
  provided: any;
  innerRef: any;
  children: JSX.Element | JSX.Element[];
};

const DraggableWrapper: React.FC<Props> = ({
  provided,
  innerRef,
  children,
}) => {
  return (
    <div
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={innerRef}
    >
      {children}
    </div>
  );
};

export default DraggableWrapper;
