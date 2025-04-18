import React, { createContext, useReducer } from 'react';
import { CometChat } from '@cometchat/chat-sdk-javascript';

// Define types for state and actions
type AppState = {
  selectedItem?: any;
  selectedItemUser?: CometChat.User;
  selectedItemGroup?: CometChat.Group;
  selectedItemCall?: CometChat.Call;
  newChat?: any;
  sideComponent: {
    visible: boolean;
    type: string;
  };
  threadedMessage?: CometChat.BaseMessage;
  isFreshChat?: boolean;
  showJoinGroup?: boolean;
};

type Action = 
  | { type: 'updateSelectedItem'; payload: any }
  | { type: 'updateSelectedItemUser'; payload: any }
  | { type: 'updateSelectedItemGroup'; payload: any }
  | { type: 'updateSelectedItemCall'; payload: any }
  | { type: 'updateSideComponent'; payload: { visible: boolean; type: string } }
  | { type: 'updateThreadedMessage'; payload: any }
  | { type: 'newChat'; payload: any }
  | { type: 'updateShowJoinGroup'; payload: boolean }
  | { type: 'updateIsFreshChat'; payload: boolean }
  | { type: 'resetAppState' };

const initialState: AppState = {
  selectedItem: undefined,
  selectedItemUser: undefined,
  selectedItemGroup: undefined,
  selectedItemCall: undefined,
  newChat: undefined,
  sideComponent: {
    visible: false,
    type: '',
  },
  threadedMessage: undefined,
  isFreshChat: false,
  showJoinGroup: false,
};

// Create context
interface AppContextProps {
  appState: AppState;
  setAppState: React.Dispatch<Action>;
}

export const AppContext = createContext<AppContextProps>({
  appState: initialState,
  setAppState: () => null,
});

// Reducer function
const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'updateSelectedItem':
      return { ...state, selectedItem: action.payload };
    case 'updateSelectedItemUser':
      return { ...state, selectedItemUser: action.payload };
    case 'updateSelectedItemGroup':
      return { ...state, selectedItemGroup: action.payload };
    case 'updateSelectedItemCall':
      return { ...state, selectedItemCall: action.payload };
    case 'updateSideComponent':
      return {
        ...state,
        sideComponent: action.payload,
      };
    case 'updateThreadedMessage':
      return { ...state, threadedMessage: action.payload };
    case 'newChat':
      return { ...state, newChat: action.payload };
    case 'updateShowJoinGroup':
      return { ...state, showJoinGroup: action.payload };
    case 'updateIsFreshChat':
      return { ...state, isFreshChat: action.payload };
    case 'resetAppState':
      return initialState;
    default:
      return state;
  }
};

// Provider component
export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appState, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ appState, setAppState: dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
