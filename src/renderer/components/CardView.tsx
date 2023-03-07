import { Card } from '@mui/material';
import { electron } from 'process';
import { useContext, useRef } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import useRatio from 'renderer/hooks/useRatio';
import { AppState } from 'renderer/utils/AppStateComponent';
import DraggableWrapper from './DraggableWrapper';
type props = {
  orientation: Boolean;
  color: string;
};
const CardView = ({ orientation, color }: props) => {
  const [width, height] = useRatio(orientation);
  const { state, dispatch } = useContext(AppState);

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.index === source.index) return;
    if (
      destination.droppableId !== 'toolbar' &&
      source.droppableId !== 'toolbar'
    ) {
      const newOrder = Array.from(state.contentOrder);
      newOrder.splice(source.index, 1);
      newOrder.splice(destination.index, 0, draggableId);
      dispatch({ type: 'contentOrder', payload: newOrder });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
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
                        {state.children[key]}
                      </DraggableWrapper>
                    )}
                  </Draggable>
                ))
              : undefined}

            {provided.placeholder}
          </Card>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default CardView;
