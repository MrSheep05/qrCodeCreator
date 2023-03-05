import { IconButton, Tooltip } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import { useRef } from 'react';

const FileButton = () => {
  const fileInput = useRef<HTMLInputElement>(null);
  const imageTypes = ['image/gif', 'image/jpeg', 'image/png'];
  const fileButtonFn = () => {
    if (fileInput.current) {
      fileInput.current.click();
    }
  };

  return (
    <div>
      <input
        type="file"
        style={{ display: 'none' }}
        ref={fileInput}
        onChange={({ target }) => {
          if (target.files) {
            const checkedTypes = [...target.files].filter((file) =>
              imageTypes.includes(file.type)
            );
            target.value = '';
            console.log(checkedTypes);
          }
        }}
        onSubmit={() => {
          console.log('Aa');
        }}
      />

      <Tooltip title="Wstaw obraz">
        <IconButton size="small" onClick={fileButtonFn}>
          <ImageIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default FileButton;