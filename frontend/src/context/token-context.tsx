import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useReducer
} from 'react';

import { ethers } from "ethers";

import TokenArtifact from "./../contracts/Burner.json";
import contractAddress from "./../contracts/contract-address.json";

// State
interface ITokenState {
  name: string,
  symbol: string,
  supply: number,
}

const initialState: ITokenState = {
  name: "",
  symbol: "",
  supply: 0,
}

// Reducer
type TokenAction =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_SYMBOL'; payload: string }
  | { type: 'SET_SUPPLY'; payload: number }

const reducer = (state: ITokenState, action: TokenAction): ITokenState => {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.payload }
    case 'SET_SYMBOL':
      return { ...state, symbol: action.payload }
    case 'SET_SUPPLY':
      return { ...state, supply: action.payload }
  }
}

// Context
interface ITokenContext {
  state: ITokenState,
} 

const defaultContext: ITokenContext = {
  state: initialState,
}

const TokenContext = createContext<ITokenContext>(defaultContext);

// Context Provider
interface IProviderProps {
  children: React.ReactNode,
}

const TokenContextProvider: FC<IProviderProps> = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(
    contractAddress.Burner,
    TokenArtifact.abi,
    provider.getSigner(0)
  );

  useEffect(() => {
    getName();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getName = async () => {
    const name = await contract.name();
    dispatch({type: 'SET_NAME', payload: name});
  };

  useEffect(() => {
    getSymbol();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSymbol = async () => {
    const symbol = await contract.symbol();
    dispatch({type: 'SET_SYMBOL', payload: symbol});
  };

  useEffect(() => {
    getSupply();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSupply = async () => {
    const supply = await contract.totalSupply();
    dispatch({type: 'SET_SUPPLY', payload: parseInt(supply)});
  };

  return (
    <TokenContext.Provider
      value={{ state }}
    >
      {children}
    </TokenContext.Provider>
  )
}

const useToken = () => useContext(TokenContext)
const useTokenState = () => useContext(TokenContext).state

export { TokenContextProvider, useToken, useTokenState }
