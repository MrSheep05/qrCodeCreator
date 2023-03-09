import { AppBar, Toolbar } from '@mui/material';
import { useContext, useRef, useState } from 'react';
import { AppState } from 'renderer/utils/AppStateComponent';
import { Droppable, Draggable, DragDropContext } from 'react-beautiful-dnd';
import BrushIcon from '@mui/icons-material/Brush';
import tinymce from 'tinymce';
import CardView from './CardView';
import AspectRatioButton from './buttons/AspectRatioButton';
import ColorPickerButton from './buttons/ColorPickerButton';
import FileButton from './buttons/FileButton';
import OrientationButton from './buttons/OrientationButton';
import QRCodeButton from './buttons/QRCodeButton';
import TextAreaButton from './buttons/TextAreaButton';
import DraggableWrapper from './DraggableWrapper';
import PlaceholderButton from './buttons/PlaceholderButton';
import CreateTemplateButton from './buttons/CreateTemplateButton';
import NavigationMenuButton from './buttons/NavigationMenuButton';
import TextEditorBar from './TextEditorBar';
import OrderContainerButton from './buttons/OrderContainerButton';

function CardCreator() {
  const { state, dispatch } = useContext(AppState);
  const [color, setColor] = useState<string>('#ffffff');
  const cardViewRef = useRef<HTMLDivElement>(null);
  const [isHorizontal, setIsHorizontal] = useState<boolean>(true);

  const orientationButtonFn = (isTrue = true) => {
    return () => {
      setIsHorizontal(isTrue);
    };
  };

  const colorChangeFn = ({ target }: { target: HTMLInputElement }) => {
    setColor(target.value);
  };

  const onDragEnd = (result: any) => {
    tinymce.execCommand('mceRepaint', false, 'Filip');

    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.index === source.index) return;
    if (
      destination.droppableId === 'toolbar' &&
      source.droppableId === 'toolbar'
    ) {
      const newOrder = Array.from(state.buttonsOrder);
      newOrder.splice(source.index, 1);
      newOrder.splice(destination.index, 0, draggableId);
      dispatch({ type: 'setButtonsOrder', payload: newOrder });
    }
  };

  const buttons: { [key: string]: JSX.Element } = {
    button1: <FileButton />,

    button3: (
      <OrientationButton
        fn={orientationButtonFn(false)}
        isDisabled={!isHorizontal}
        type="vertical"
      />
    ),

    button2: (
      <OrientationButton
        fn={orientationButtonFn(true)}
        isDisabled={isHorizontal}
        type="horizontal"
      />
    ),

    button4: <AspectRatioButton />,
    button5: <QRCodeButton />,
    button6: (
      <ColorPickerButton fn={colorChangeFn} title="Kolor karty">
        <BrushIcon />
      </ColorPickerButton>
    ),
    button7: <TextAreaButton />,
    button8: <PlaceholderButton />,
    button9: <CreateTemplateButton cardView={cardViewRef} />,
    button10: <OrderContainerButton isHorizontal={isHorizontal} />,
  };

  return (
    <div style={{ display: 'grid' }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <AppBar
          position="absolute"
          sx={{
            borderBottomLeftRadius: '5px',
            borderBottomRightRadius: '5px',
            width: '100%',
            height: '8vmin',
            backgroundColor: '#ffffff',
            maxHeight: '50px',
          }}
        >
          <Droppable droppableId="toolbar" direction="horizontal">
            {(provided) => (
              <Toolbar
                {...provided.droppableProps}
                ref={provided.innerRef}
                variant="dense"
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignContent: 'center',
                  justifyContent: 'flex-start',
                  gap: '10px',
                }}
              >
                {state.buttonsOrder.map((key, id) => (
                  <Draggable draggableId={key} index={id} key={key}>
                    {(provided) => (
                      <DraggableWrapper
                        provided={provided}
                        innerRef={provided.innerRef}
                      >
                        {buttons[key]}
                      </DraggableWrapper>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}

                <NavigationMenuButton />
              </Toolbar>
            )}
          </Droppable>
        </AppBar>
      </DragDropContext>

      <CardView
        orientation={isHorizontal}
        color={color}
        innerRef={cardViewRef}
      />

      <TextEditorBar />
    </div>
  );
}

export default CardCreator;
