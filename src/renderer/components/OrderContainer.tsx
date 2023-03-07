import { Resizable } from 're-resizable';
import { useContext, useEffect, useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import useResizing from 'renderer/hooks/useResizing';
import { contextMenuEventProvider, MouseDimension } from 'renderer/utils';
import { AppState } from 'renderer/utils/AppStateComponent';
import ContextMenu from './ContextMenu';
import DraggableWrapper from './DraggableWrapper';

type Props = {
  index: number;
  isHorizontal: boolean;
};
const initialSize = { width: 100, height: 100 };

const OrderContainer = ({ index, isHorizontal }: Props) => {
  const [style, setStyle] = useState<{ width: number; height: number }>(
    initialSize
  );
  const [resizingStyle, setResizing] = useResizing();
  const [mouseContext, setMouseContext] = useState<MouseDimension>(null);
  const { state } = useContext(AppState);

  return (
    <div>
      <Resizable
        onResizeStart={(e) => {
          e.stopPropagation();
          setResizing(true);
        }}
        defaultSize={initialSize}
        onResizeStop={(_, __, ___, delta) => {
          setStyle({
            width: style.width + delta.width,
            height: style.height + delta.height,
          });
          setResizing(false);
        }}
        style={resizingStyle}
      >
        <div
          className="placeholder"
          onDoubleClick={contextMenuEventProvider({
            mouseContext,
            setMouseContext,
          })}
          style={style}
        >
          <Droppable
            droppableId={`${index}`}
            direction={isHorizontal ? 'vertical' : 'horizontal'}
          >
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{ width: '100%', height: '100%' }}
              >
                {Object.keys(state.columnItems).includes(`${index}`)
                  ? state.columnItems[`${index}`].map((key, index) => (
                      <Draggable draggableId={key} index={index} key={key}>
                        {(provided, snapshot) => (
                          <DraggableWrapper
                            provided={provided}
                            id={key}
                            innerRef={provided.innerRef}
                            isDragging={snapshot.isDragging}
                          >
                            {state.children[key].content}
                          </DraggableWrapper>
                        )}
                      </Draggable>
                    ))
                  : undefined}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </Resizable>
      <ContextMenu
        action="removeColumn"
        index={index}
        mouseContext={mouseContext}
        setMouseContext={setMouseContext}
      />
    </div>
  );
};

export default OrderContainer;
