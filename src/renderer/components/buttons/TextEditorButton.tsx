import { Tooltip, IconButton } from '@mui/material';
import tinymce from 'tinymce/tinymce';

type Props = {
  title: string;
  execCommand: string;
  children: JSX.Element;
};
const TextEditorButton: React.FC<Props> = ({
  title,
  execCommand,
  children,
}) => {
  return (
    <Tooltip title={title}>
      <IconButton
        onClick={() =>
          tinymce.activeEditor?.editorCommands.execCommand(execCommand)
        }
      >
        {children}
      </IconButton>
    </Tooltip>
  );
};

export default TextEditorButton;
