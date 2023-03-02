import { AppBar, Toolbar, IconButton, Popover, TextField } from '@mui/material';
import { useContext, useRef, useState } from 'react';
import CardView from './CardView';
import { AppState } from 'renderer/utils/AppStateComponent';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import AspectRatioButton from './AspectRatioButton';
import ColorPickerButton from './ColorPickerButton';
import FileButton from './FileButton';
import OrientationButton from './OrientationButton';
import QRCodeButton from './QRCodeButton';
import TextAreaButton from './TextAreaButton';
import DraggableWrapper from './DraggableWrapper';

const CardCreator = () => {
  const { state, dispatch } = useContext(AppState);
  const fileInput = useRef<HTMLInputElement>(null);
  const [color, setColor] = useState<string>('#ffffff');
  const [isHorizontal, setIsHorizontal] = useState<boolean>(true);

  const fileButtonFn = () => {
    if (fileInput.current) {
      fileInput.current.click();
    }
  };

  const orientationButtonFn = (isTrue = true) => {
    return () => {
      setIsHorizontal(isTrue);
    };
  };

  const colorChangeFn = ({ target }: { target: HTMLInputElement }) => {
    setColor(target.value);
  };

  const buttonsOrder = [
    <FileButton fn={fileButtonFn} />,
    <OrientationButton
      fn={orientationButtonFn(false)}
      isDisabled={!isHorizontal}
      type="vertical"
    />,
    <OrientationButton
      fn={orientationButtonFn()}
      isDisabled={isHorizontal}
      type="horizontal"
    />,
    <AspectRatioButton />,
    <QRCodeButton></QRCodeButton>,
    <ColorPickerButton fn={colorChangeFn} />,
    <TextAreaButton></TextAreaButton>,
  ];

  return (
    <div>
      <input type="file" style={{ display: 'none' }} ref={fileInput} />
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
        className="gradient"
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
              {buttonsOrder.map((component, id) => (
                <Draggable draggableId={`button${id}`} index={id} key={id}>
                  {(provided) => (
                    <DraggableWrapper
                      provided={provided}
                      id={id}
                      innerRef={provided.innerRef}
                    >
                      {component}
                    </DraggableWrapper>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Toolbar>
          )}
        </Droppable>
      </AppBar>

      <CardView orientation={isHorizontal} color={color}></CardView>
    </div>
  );
};

export default CardCreator;
