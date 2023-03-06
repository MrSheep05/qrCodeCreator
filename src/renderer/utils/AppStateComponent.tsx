import { createContext, useReducer } from 'react';
import { Children } from 'react';

interface Props {
  children: JSX.Element[] | JSX.Element;
}

interface ChildrenList {
  [key: string]: JSX.Element;
}
type Action = {
  type:
    | 'setRatio'
    | 'setQR'
    | 'appendChild'
    | 'setButtonsOrder'
    | 'removeChild'
    | 'contentOrder';
  payload: string | JSX.Element | string[] | number | undefined;
};

type State = {
  selectedRatio: string;
  qr: string | undefined;
  children: ChildrenList;
  buttonsOrder: string[];
  index: number;
};

type AppStateContext = {
  state: State;
  dispatch: (action: Action) => void;
};

const saveInLocalStorage = ({
  data,
  dataName,
}: {
  data: any;
  dataName: string;
}) => {
  window.localStorage.setItem(dataName, JSON.stringify(data));
};

const getFromLocalStorage = ({
  dataName,
  ifFailed,
}: {
  dataName: string;
  ifFailed: any;
}) => {
  const items = window.localStorage.getItem(dataName);
  if (items && initialButtonsOrder.length === JSON.parse(items).length) {
    return JSON.parse(items);
  }
  return ifFailed;
};

const initialButtonsOrder = [
  'button1',
  'button2',
  'button3',
  'button4',
  'button5',
  'button6',
  'button7',
  'button8',
  'button9',
];

export const AppState = createContext({} as AppStateContext);

export const initialState = {
  selectedRatio: '16:9',
  qr: undefined,
  buttonsOrder: getFromLocalStorage({
    ifFailed: initialButtonsOrder,
    dataName: 'buttonsOrder',
  }),
  index: 0,
};

export const reducer = (state: State, action: Action): any => {
  switch (action.type) {
    case 'setRatio': {
      return { ...state, selectedRatio: `${action.payload}` };
    }
    case 'setQR': {
      return { ...state, qr: action.payload };
    }
    case 'appendChild': {
      return {
        ...state,
        index: state.index + 1,
        children: { ...state.children, [state.index]: action.payload },
      };
    }

    case 'setButtonsOrder': {
      return { ...state, buttonsOrder: action.payload };
    }

    case 'removeChild': {
      if (typeof action.payload === 'number') {
        delete state.children[action.payload];
        return { ...state, children: state.children };
      }
    }

    case 'contentOrder': {
    }

    default: {
      return { ...state };
    }
  }
};

const AppStateComponent = ({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  window.onclose = () => {
    saveInLocalStorage({ dataName: 'buttonsOrder', data: state.buttonsOrder });
  };

  window.onbeforeunload = () => {
    saveInLocalStorage({ dataName: 'buttonsOrder', data: state.buttonsOrder });
  };

  return (
    <AppState.Provider value={{ state, dispatch }}>
      {children}
    </AppState.Provider>
  );
};

export default AppStateComponent;
