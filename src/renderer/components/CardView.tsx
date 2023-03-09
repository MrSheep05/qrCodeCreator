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
function CardView({ orientation, color, innerRef }: props) {
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

    if (destination.droppableId === draggableId) return;

    const isDestinationColumn = Object.keys(state.columnItems).includes(
      destination.droppableId
    );
    const isSourceColumn = Object.keys(state.columnItems).includes(
      source.droppableId
    );

    if (destination.droppableId === 'card' && source.droppableId === 'card') {
      const newOrder = state.contentOrder;
      newOrder.splice(source.index, 1);
      newOrder.splice(destination.index, 0, draggableId);
      dispatch({
        type: 'contentOrder',
        payload: newOrder,
        columns: state.columnItems,
        place: state.children,
      });
      return;
    }

    if (isDestinationColumn && isSourceColumn) {
      if (destination.droppableId === source.droppableId) {
        const newColumn = state.columnItems[destination.droppableId];
        newColumn.splice(source.index, 1);
        newColumn.splice(destination.index, 0, draggableId);
        dispatch({
          type: 'contentOrder',
          payload: state.contentOrder,
          columns: {
            ...state.columnItems,
            [destination.droppableId]: newColumn,
          },
          place: state.children,
        });
        return;
      }
      const sourceColumn = state.columnItems[source.droppableId];
      const destinationColumn = state.columnItems[destination.droppableId];

      sourceColumn.splice(source.index, 1);
      destinationColumn.splice(destination.index, 0, draggableId);
      dispatch({
        type: 'contentOrder',
        payload: state.contentOrder,
        columns: {
          ...state.columnItems,
          [source.droppableId]: sourceColumn,
          [destination.droppableId]: destinationColumn,
        },
        place: {
          ...state.children,
          [draggableId]: {
            ...state.children[draggableId],
            placement: destination.droppableId,
          },
        },
      });
      return;
    }

    if (
      (isDestinationColumn && source.droppableId === 'card') ||
      (isSourceColumn && destination.droppableId === 'card')
    ) {
      const condition =
        Object.keys(state.columnItems).includes(destination.droppableId) &&
        source.droppableId === 'card';
      const newOrder = state.contentOrder;

      const columnIndex = condition
        ? destination.droppableId
        : source.droppableId;
      const newColumns = state.columnItems[columnIndex];

      if (condition) {
        newColumns.splice(destination.index, 0, draggableId);
        newOrder.splice(source.index, 1);
      } else {
        newOrder.splice(destination.index, 0, draggableId);
        newColumns.splice(source.index, 1);
      }
      dispatch({
        type: 'contentOrder',
        payload: newOrder,
        columns: { ...state.columnItems, [columnIndex]: newColumns },
        place: {
          ...state.children,
          [draggableId]: {
            ...state.children[draggableId],
            placement: columnIndex,
          },
        },
      });
      return;
    }
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
                    <Draggable
                      draggableId={`${key}`}
                      index={index}
                      key={`c${key}`}
                    >
                      {(provided) => (
                        <DraggableWrapper
                          provided={provided}
                          innerRef={provided.innerRef}
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
}

export default CardView;
