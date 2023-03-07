import { Card } from '@mui/material';
import { useContext, useRef } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import useRatio from 'renderer/hooks/useRatio';
import { AppState } from 'renderer/utils/AppStateComponent';
import DraggableWrapper from './DraggableWrapper';
type props = {
  orientation: Boolean;
  color: string;
  innerRef: React.RefObject<HTMLDivElement>;
};
const CardView = ({ orientation, color, innerRef }: props) => {
  const [width, height] = useRatio(orientation);
  const { state, dispatch } = useContext(AppState);

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    )
      return;

    if (destination.droppableId === 'card' && source.droppableId === 'card') {
      const newOrder = state.contentOrder;
      newOrder.splice(source.index, 1);
      newOrder.splice(destination.index, 0, draggableId);
      dispatch({
        type: 'contentOrder',
        payload: newOrder,
      });
      return;
    }

    // if (
    //   destination.droppableId === 'card' &&
    //   source.droppableId !== destination.droppableId
    // ) {
    //   const newColumnItems = state.columnItems[source.droppableId];
    //   newColumnItems.splice(source.index, 1);

    //   const newOrder = state.contentOrder;
    //   newOrder.splice(destination.index, 0, draggableId);
    //   dispatch({
    //     type: 'contentOrder',
    //     payload: newOrder,
    //     columnOrder: { [source.droppableId]: newColumnItems },
    //     index: draggableId,
    //     placement: undefined,
    //   });
    //   return;
    // }

    // if (
    //   destination.droppableId !== source.droppableId &&
    //   source.droppableId === 'card'
    // ) {
    //   const newColumnItems = state.columnItems[destination.droppableId];
    //   newColumnItems.splice(destination.index, 0, draggableId);

    //   const newOrder = state.contentOrder;
    //   newOrder.splice(source.index, 1);
    //   dispatch({
    //     type: 'contentOrder',
    //     payload: newOrder,
    //     columnOrder: { [destination.droppableId]: newColumnItems },
    //     index: draggableId,
    //     placement: destination.droppableId,
    //   });
    //   return;
    // }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div ref={innerRef}>
        <Droppable
          droppableId="card"
          direction={orientation ? 'horizontal' : 'vertical'}
        >
          {(provided) => (
            <Card
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{
                height,
                width,
                borderRadius: '1rem',
                backgroundColor: color,
                display: 'flex',
                flexDirection: orientation ? 'row' : 'column',
                alignItems: 'center',
                justifyItems: 'center',
              }}
              variant="outlined"
            >
              {state.contentOrder
                ? state.contentOrder.map((key, index) => (
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
            </Card>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

export default CardView;
