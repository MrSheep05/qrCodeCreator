import { TextField } from '@mui/material';
import tinymce from 'tinymce';

type Props = {
  label: string;
  value?: string;
};
const FamilyFont = ({ label, value }: Props) => {
  if (value) {
    tinymce.activeEditor?.execCommand('FontName', false, value);
  }

  return <TextField label={label} />;
};

export default FamilyFont;
