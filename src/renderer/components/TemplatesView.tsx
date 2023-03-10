import { AppBar, Toolbar } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import NavigationMenuButton from './buttons/NavigationMenuButton';
import TemplateCard from './TemplateCard';

function TemplatesView() {
  const [templates, setTemplates] = useState<
    { [key: string]: string } | undefined
  >(undefined);
  const prepare = useRef<HTMLDivElement>(null);
  const getTemplates = useCallback(async () => {
    const temps = await window.electron.ipcRenderer.invoke('getContent');
    setTemplates(temps);
  }, []);

  useEffect(() => {
    getTemplates().catch(console.error);
  }, [getTemplates]);

  const cardCount = templates ? Object.keys(templates!).length : false;
  const setRows = () => {
    if (cardCount) {
      return cardCount % 3 > 0
        ? [...Array(~~(cardCount / 3) + 1).keys()]
        : [...Array(cardCount / 3).keys()];
    }
    return false;
  };
  const rowsNumber = setRows();
  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
      }}
    >
      <div
        ref={prepare}
        style={{ position: 'absolute', width: '100vw', height: '100vh' }}
      ></div>
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
        <Toolbar
          variant="dense"
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'flex-start',
            gap: '10px',
          }}
        >
          <NavigationMenuButton />
        </Toolbar>
      </AppBar>
      <div className="scrollContainer">
        <div
          style={{
            display: 'none',
            flexDirection: 'row-reverse',
            height: '20vmin',
          }}
        ></div>
        {rowsNumber
          ? rowsNumber.map((index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'row-reverse',
                  margin: '2rem',
                  justifyContent: 'center',
                  alignContent: 'center',
                }}
              >
                {Object.keys(templates!)
                  .slice(
                    index * 3,
                    index + 1 !== rowsNumber.length
                      ? index * 3 + (rowsNumber.length % 3) + 1
                      : index * 3 + 4
                  )
                  .map((name) => {
                    console.log(
                      Object.keys(templates!).slice(
                        index * 3,
                        index + 1 === rowsNumber.length
                          ? index * 3 + (rowsNumber.length % 3) + 1
                          : index * 3 + 3
                      )
                    );
                    console.log(Object.keys(templates!));

                    return (
                      <TemplateCard
                        prepareElement={prepare.current!}
                        fileName={name}
                        key={name}
                        content={templates!}
                        setContent={setTemplates}
                      />
                    );
                  })}
              </div>
            ))
          : undefined}
      </div>
    </div>
  );
}

export default TemplatesView;
