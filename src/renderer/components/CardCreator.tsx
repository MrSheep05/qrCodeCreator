import { AppBar, Toolbar } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import CardView from './CardView';
import { AppState } from 'renderer/utils/AppStateComponent';
import { Droppable, Draggable, DragDropContext } from 'react-beautiful-dnd';
import AspectRatioButton from './AspectRatioButton';
import ColorPickerButton from './ColorPickerButton';
import FileButton from './FileButton';
import OrientationButton from './OrientationButton';
import QRCodeButton from './QRCodeButton';
import TextAreaButton from './TextAreaButton';
import DraggableWrapper from './DraggableWrapper';
import PlaceholderButton from './PlaceholderButton';
import CreateTemplateButton from './CreateTemplateButton';
import NavigationMenuButton from './NavigationMenuButton';
import TextEditorBar from './TextEditorBar';
import BrushIcon from '@mui/icons-material/Brush';

const CardCreator = () => {
  const { state, dispatch } = useContext(AppState);
  const [color, setColor] = useState<string>('#ffffff');
  const [isHorizontal, setIsHorizontal] = useState<boolean>(true);
  const [isFocused, setIsFocused] = useState<number | undefined>();

  const orientationButtonFn = (isTrue = true) => {
    return () => {
      setIsHorizontal(isTrue);
    };
  };

  const colorChangeFn = ({ target }: { target: HTMLInputElement }) => {
    setColor(target.value);
  };

  const onDragEnd = (result: any) => {
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
        fn={orientationButtonFn()}
        isDisabled={isHorizontal}
        type="horizontal"
      />
    ),

    button4: <AspectRatioButton />,
    button5: <QRCodeButton></QRCodeButton>,
    button6: (
      <ColorPickerButton fn={colorChangeFn} title={'Kolor karty'}>
        <BrushIcon />
      </ColorPickerButton>
    ),
    button7: <TextAreaButton fn={setIsFocused} />,
    button8: <PlaceholderButton />,
    button9: <CreateTemplateButton />,
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
                        id={key}
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

      <CardView orientation={isHorizontal} color={color}></CardView>

      <TextEditorBar focus={isFocused} setFocus={setIsFocused} />
    </div>
  );
};

export default CardCreator;
