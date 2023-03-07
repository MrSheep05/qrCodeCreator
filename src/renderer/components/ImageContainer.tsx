import { Resizable } from 're-resizable';
import { useEffect, useState } from 'react';

const ImageContainer = ({ image }: { image: File }) => {
  const [size, setSize] = useState<{ width: number; height: number }>();
  useEffect(() => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(image);
    img.onload = () => {
      setSize({ width: 200, height: (img.height / img.width) * 200 });
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  }, []);

  return (
    <div style={size}>
      <Resizable
        onResizeStart={(e) => {
          e.stopPropagation();
        }}
        onResizeStop={(_, __, ___, delta) =>
          setSize({
            width: size!.width + delta.width,
            height: size!.height + delta.height,
          })
        }
      >
        <img src={URL.createObjectURL(image)} style={size}></img>
      </Resizable>
    </div>
  );
};

export default ImageContainer;
