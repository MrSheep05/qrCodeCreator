import { AppBar, IconButton, Paper, Toolbar, Tooltip } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import {
  Clear,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  StrikethroughS,
  FormatAlignLeft,
  FormatAlignRight,
  FormatAlignCenter,
  FormatAlignJustify,
  FormatColorText,
  Remove,
  Add,
} from '@mui/icons-material/';
import TextEditorButton from './TextEditorButton';
import ColorPickerButton from './ColorPickerButton';
import tinymce from 'tinymce/tinymce';
import { AppState } from 'renderer/utils/AppStateComponent';

type Props = {
  focus: number | undefined;
  setFocus: React.Dispatch<React.SetStateAction<number | undefined>>;
};
const TextEditorBar = ({ focus, setFocus }: Props) => {
  const [color, setColor] = useState<string>('#000000');
  const { dispatch } = useContext(AppState);
  const [size, setSize] = useState<number>(8);
  useEffect(() => {
    tinymce.activeEditor?.execCommand('ForeColor', false, color);
  }, [color]);
  return (
    <AppBar
      position="fixed"
      sx={{
        display: 'flex',
        borderTopLeftRadius: '5px',
        borderTopRightRadius: '5px',
        width: '80%',
        height: '7vmin',
        backgroundColor: '#ffffff',
        maxHeight: '50px',
        top: 'auto',
        bottom: 0,
        justifyContent: 'center',
        justifySelf: 'center',
        right: 'unset',
      }}
    >
      <Toolbar>
        <Paper>
          <IconButton
            onClick={() => {
              if (size > 1) {
                const newSize = size - 1;
                setSize(newSize);
                tinymce.activeEditor?.execCommand(
                  'FontSize',
                  false,
                  `${newSize}px`
                );
              }
            }}
            disabled={size <= 1}
          >
            <Remove />
          </IconButton>
          <input
            type="number"
            value={size}
            onChange={({ target }) => {
              const regex = /\b[1-3]?\d{1}\b/gm;
              if (regex.test(target.value)) {
                const value = parseInt(target.value);
                if (value >= 30 || typeof value !== 'number') {
                  setSize(30);
                } else {
                  setSize(value);
                }
              } else {
                setSize(8);
              }

              tinymce.activeEditor?.execCommand('FontSize', false, `${size}px`);
            }}
          ></input>
          <IconButton
            onClick={() => {
              if (size < 30) {
                const newSize = size + 1;
                setSize(newSize);
                tinymce.activeEditor?.execCommand(
                  'FontSize',
                  false,
                  `${newSize}px`
                );
              }
            }}
            disabled={size >= 30}
          >
            <Add />
          </IconButton>
        </Paper>
        <TextEditorButton title="Pogrubienie tekstu" execCommand="Bold">
          <FormatBold />
        </TextEditorButton>

        <TextEditorButton title="Pochylenie tekstu" execCommand="Italic">
          <FormatItalic />
        </TextEditorButton>

        <TextEditorButton title="Podkreślenie tekstu" execCommand="Underline">
          <FormatUnderlined />
        </TextEditorButton>

        <ColorPickerButton
          title={'Kolor tekstu'}
          fn={({ target }) => {
            setColor(target.value);
          }}
          defaultValue={'#000000'}
        >
          <FormatColorText />
        </ColorPickerButton>

        <TextEditorButton title="Skreślenie tekstu" execCommand="Strikethrough">
          <StrikethroughS />
        </TextEditorButton>

        <TextEditorButton title="Wyrównaj do lewej" execCommand="JustifyLeft">
          <FormatAlignLeft />
        </TextEditorButton>

        <TextEditorButton
          title="Wyrównaj do środka"
          execCommand="JustifyCenter"
        >
          <FormatAlignCenter />
        </TextEditorButton>

        <TextEditorButton title="Wyrównaj do prawej" execCommand="JustifyRight">
          <FormatAlignRight />
        </TextEditorButton>

        <TextEditorButton title="Wyrównaj" execCommand="JustifyFull">
          <FormatAlignJustify />
        </TextEditorButton>

        <Tooltip title="Usuń pole tekstowe">
          <IconButton
            sx={{ marginLeft: 'auto' }}
            onClick={() => {
              dispatch({ type: 'removeChild', payload: focus });
              setFocus(undefined);
            }}
          >
            <Clear sx={{ color: 'red' }} />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default TextEditorBar;
