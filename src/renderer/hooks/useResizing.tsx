import { SetStateAction, useState } from 'react';

const useResizing = (): [
  React.CSSProperties,
  React.Dispatch<SetStateAction<boolean>>
] => {
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const resizingStyle = isResizing
    ? {
        borderRadius: '5px',
        borderWidth: '3px',
        borderStyle: 'dotted',
        borderColor: 'aqua',
      }
    : { border: 'unset' };

  return [resizingStyle, setIsResizing];
};

export default useResizing;
