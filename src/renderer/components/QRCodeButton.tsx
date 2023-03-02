import {
  IconButton,
  Dialog,
  DialogActions,
  Button,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
} from '@mui/material';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import QRCode from 'qrcode';
import { Children, useContext, useState } from 'react';
import { AppState } from 'renderer/utils/AppStateComponent';

const inputs = [
  // { id: 'name', label: 'Imię', isRequired: true, isValid: true },
  // { id: 'surname', label: 'Nazwisko', isRequired: true, isValid: true },
  // { id: 'workplace', label: 'Stanowisko', isRequired: false, isValid: true },
  { id: 'id', label: 'ID', isRequired: true, isValid: true },
];

const initialValues = {
  // name: { isValid: true, value: '' },
  // surname: { isValid: true, value: '' },
  // workplace: { isValid: true, value: '' },
  id: { isValid: true, value: '' },
};

type inputValue = { [key: string]: { isValid: boolean; value: string } };
type Inputs = {
  id: string;
  label: string;
  isRequired: boolean;
  isValid: boolean;
}[];

const QRCodeButton = () => {
  const { state, dispatch } = useContext(AppState);
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [inputsValues, setInputsValues] = useState<inputValue>(initialValues);

  const prepareInputs = (inputs: Inputs) => {
    return inputs.map(({ id, label, isRequired, isValid }): JSX.Element => {
      return (
        <TextField
          key={id}
          id={id}
          label={label}
          value={inputsValues[id].value}
          required={isRequired}
          error={!inputsValues[id].isValid}
          margin="dense"
          autoFocus
          type="text"
          fullWidth
          variant="standard"
          onChange={({ target }) => {
            setInputsValues({
              ...inputsValues,
              [id]: { isValid: true, value: target.value },
            });
          }}
        />
      );
    });
  };

  const createQR = async (value: string) => {
    const canvas = document.createElement('canvas');
    await QRCode.toCanvas(canvas, value, { margin: 1 });
    const jsx = await (
      <div
        ref={(ref) => {
          ref?.appendChild(canvas);
        }}
        key={Children.count(state.children)}
        style={{
          fontSize: 8,
          textAlign: 'center',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column-reverse',
          margin: 0,
        }}
      >
        <span>{inputsValues['id'].value}</span>
      </div>
    );

    dispatch({
      type: 'appendChild',
      payload: jsx,
    });
  };

  return (
    <div>
      <IconButton
        size="small"
        onClick={async () => {
          if (state.qr) {
            createQR(state.qr);
            return;
          }
          setIsOpened(true);
        }}
      >
        <QrCode2Icon />
      </IconButton>
      <Dialog
        open={isOpened}
        onClose={() => {
          setIsOpened(false);
          setInputsValues(initialValues);
        }}
      >
        <DialogTitle>Stwórz kod qr</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Wprowadź potrzebne dane, do wygenerowania kodu QR
          </DialogContentText>
          {prepareInputs(inputs)}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setIsOpened(false);
              setInputsValues(initialValues);
            }}
          >
            Wstecz
          </Button>
          <Button
            onClick={async () => {
              const isCorrect = Object.keys(inputsValues).reduce<boolean>(
                (isCorrect, key): boolean => {
                  if (
                    inputsValues[key].value === '' &&
                    inputs.find((x) => x.id === key)?.isRequired
                  ) {
                    setInputsValues({
                      ...inputsValues,
                      [key]: { isValid: false, value: '' },
                    });
                    return false;
                  }
                  return isCorrect;
                },
                true
              );
              if (isCorrect) {
                const userData = Object.keys(inputsValues).reduce(
                  (previous, key) => `${previous} ` + inputsValues[key].value,
                  ''
                );
                dispatch({ type: 'setQR', payload: userData });
                await createQR(userData);
                setIsOpened(false);
              }
            }}
          >
            Zatwierdź
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default QRCodeButton;
