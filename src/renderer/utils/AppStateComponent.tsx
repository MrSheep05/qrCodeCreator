import { createContext, useReducer } from 'react';

interface Props {
  children: JSX.Element[] | JSX.Element;
}

interface ChildrenList {
  [key: string]: { content: JSX.Element; placement: undefined | string };
}
export type Action = {
  type:
    | 'setRatio'
    | 'setQR'
    | 'appendChild'
    | 'setButtonsOrder'
    | 'removeChild'
    | 'contentOrder'
    | 'appendColumn'
    | 'removeColumn'
    | 'setLocation';
  payload: string | JSX.Element | string[] | number | undefined | boolean;
  columns?: { [key: string]: string[] };
  place?: {
    [key: string]: { content: JSX.Element; placement: string };
  };
};

type State = {
  selectedRatio: string;
  qr: string | undefined;
  children: ChildrenList;
  buttonsOrder: string[];
  index: number;
  contentOrder: string[];
  columnItems: { [key: string]: string[] };
  location: string;
};

type AppStateContext = {
  state: State;
  dispatch: (action: Action) => void;
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
  'button10',
];

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

export const AppState = createContext({} as AppStateContext);

export const initialState = {
  selectedRatio: '16:9',
  qr: undefined,
  buttonsOrder: getFromLocalStorage({
    ifFailed: initialButtonsOrder,
    dataName: 'buttonsOrder',
  }),
  index: 0,
  contentOrder: [],
  location: '',
  columnItems: {},
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
        children: {
          ...state.children,
          [state.index]: { content: action.payload, placement: 'card' },
        },
        contentOrder: [...state.contentOrder, `${state.index}`],
      };
    }

    case 'appendColumn': {
      return {
        ...state,
        index: state.index + 1,
        children: {
          ...state.children,
          [state.index]: { content: action.payload, placement: 'card' },
        },
        contentOrder: [...state.contentOrder, `${state.index}`],
        columnItems: { ...state.columnItems, [state.index]: [] },
      };
    }

    case 'setButtonsOrder': {
      return { ...state, buttonsOrder: action.payload };
    }

    case 'removeChild': {
      if (typeof action.payload === 'number') {
        if (state.children[action.payload].placement !== 'card') {
          const columnId = state.children[action.payload].placement;
          delete state.children[action.payload];
          console.log(state.children);
          return {
            ...state,
            children: state.children,
            columnItems: {
              ...state.columnItems,
              [columnId!]: state.columnItems[columnId!].filter(
                (itemKey: string) => itemKey !== `${action.payload}`
              ),
            },
          };
        }
        delete state.children[action.payload];
        console.log(state.children);

        return {
          ...state,
          children: state.children,
          contentOrder: state.contentOrder.filter(
            (value) => value !== `${action.payload}`
          ),
        };
      }
    }

    case 'removeColumn': {
      if (
        typeof action.payload === 'string' ||
        typeof action.payload === 'number'
      ) {
        const childrenToRemove = state.columnItems[action.payload];
        childrenToRemove.forEach((key) => delete state.children[key]);
        delete state.columnItems[action.payload];

        return {
          ...state,
          children: state.children,
          columnItems: state.columnItems,
          contentOrder: state.contentOrder.filter(
            (value) => value !== `${action.payload}`
          ),
        };
      }
      break;
    }

    case 'contentOrder': {
      if (Object.keys(action).includes('columns')) {
        return {
          ...state,
          contentOrder: action.payload,
          columnItems: action.columns,
          children: action.place,
        };
      }
      break;
    }

    case 'setLocation': {
      return { ...state, location: action.payload };
    }

    default: {
      return { ...state };
    }
  }
};

function AppStateComponent({ children }: Props) {
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
}

export default AppStateComponent;
