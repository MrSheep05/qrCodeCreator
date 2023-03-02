import { createContext, useReducer } from 'react';
import { Children } from 'react';
interface Props {
  children: JSX.Element[] | JSX.Element;
}

type Action = {
  type: string;
  payload: string | JSX.Element;
};

type State = {
  selectedRatio: string;
  qr: string | undefined;
  children: JSX.Element[];
};

type AppStateContext = {
  state: State;
  dispatch: (action: Action) => void;
};

export const AppState = createContext({} as AppStateContext);

export const initialState = { selectedRatio: '16:9', qr: undefined };

export const reducer = (state: State, action: Action): any => {
  switch (action.type) {
    case 'setRatio': {
      return { ...state, selectedRatio: `${action.payload}` };
    }
    case 'setQR': {
      return { ...state, qr: action.payload };
    }
    case 'appendChild': {
      const currentChildren =
        Children.count(state.children) > 1
          ? [...state.children]
          : [state.children];
      return {
        ...state,
        children: [...currentChildren, action.payload as JSX.Element],
      };
    }
    default: {
      return { ...state };
    }
  }
};

const AppStateComponent = ({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppState.Provider value={{ state, dispatch }}>
      {children}
    </AppState.Provider>
  );
};

export default AppStateComponent;
