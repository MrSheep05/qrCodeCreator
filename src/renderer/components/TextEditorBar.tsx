import {
  AppBar,
  Autocomplete,
  IconButton,
  Paper,
  TextField,
  Toolbar,
  Tooltip,
} from '@mui/material';
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
  Gradient,
} from '@mui/icons-material/';
import tinymce from 'tinymce/tinymce';
import { AppState } from 'renderer/utils/AppStateComponent';
import TextEditorButton from './buttons/TextEditorButton';
import ColorPickerButton from './buttons/ColorPickerButton';
import { familyFonts } from 'renderer/utils';
import FamilyFont from './FamilyFont';

function TextEditorBar() {
  const [color, setColor] = useState<string>('#000000');
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
  const { dispatch } = useContext(AppState);
  const [size, setSize] = useState<number>(8);

  useEffect(() => {
    tinymce.activeEditor?.execCommand('ForeColor', false, color);
  }, [color]);

  useEffect(() => {
    tinymce.activeEditor?.execCommand('HiliteColor', false, backgroundColor);
  }, [backgroundColor]);
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
          />
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
        {/* <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={familyFonts}
          sx={{ width: 300 }}
          renderInput={(params) => {
            return <FamilyFont {...params} label="Movie" />;
          }}
        /> */}
        <TextEditorButton title="Pogrubienie tekstu" execCommand="Bold">
          <FormatBold />
        </TextEditorButton>

        <TextEditorButton title="Pochylenie tekstu" execCommand="Italic">
          <FormatItalic />
        </TextEditorButton>

        <TextEditorButton title="Podkre??lenie tekstu" execCommand="Underline">
          <FormatUnderlined />
        </TextEditorButton>

        <ColorPickerButton
          title="Kolor tekstu"
          fn={({ target }) => {
            setColor(target.value);
          }}
          defaultValue="#000000"
        >
          <FormatColorText />
        </ColorPickerButton>

        <ColorPickerButton
          title="Kolor t??a"
          fn={({ target }) => {
            setBackgroundColor(target.value);
          }}
        >
          <Gradient />
        </ColorPickerButton>

        <TextEditorButton title="Skre??lenie tekstu" execCommand="Strikethrough">
          <StrikethroughS />
        </TextEditorButton>

        <TextEditorButton title="Wyr??wnaj do lewej" execCommand="JustifyLeft">
          <FormatAlignLeft />
        </TextEditorButton>

        <TextEditorButton
          title="Wyr??wnaj do ??rodka"
          execCommand="JustifyCenter"
        >
          <FormatAlignCenter />
        </TextEditorButton>

        <TextEditorButton title="Wyr??wnaj do prawej" execCommand="JustifyRight">
          <FormatAlignRight />
        </TextEditorButton>

        <TextEditorButton title="Wyr??wnaj" execCommand="JustifyFull">
          <FormatAlignJustify />
        </TextEditorButton>
      </Toolbar>
    </AppBar>
  );
}

export default TextEditorBar;
