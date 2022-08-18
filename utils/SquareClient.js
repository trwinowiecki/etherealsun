import { createContext, useReducer } from 'react';
import { Client, Environment } from 'square';

const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Sandbox,
});

export const SquareClient = createContext();

const initialState = {
  client: client,
};

function reducer(state, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export function SquareClientProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return (
    <SquareClient.Provider value={value}>{children}</SquareClient.Provider>
  );
}
