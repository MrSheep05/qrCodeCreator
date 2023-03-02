type Props = {
  provided: any;
  innerRef: any;
  id: any;
  children: JSX.Element | JSX.Element[];
};

const DraggableWrapper: React.FC<Props> = ({
  provided,
  innerRef,
  id,
  children,
}) => {
  return (
    <div
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={innerRef}
      key={id}
    >
      {children}
    </div>
  );
};

export default DraggableWrapper;
