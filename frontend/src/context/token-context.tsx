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
import { useEthereumState } from "./ethereum-context";

// State
interface ITokenState {
  address: string,
  burningRate: number,
  initialSupply: number,
  name: string,
  owner: string,
  presale?: boolean,
  symbol: string,
  supply: number,
  balance: number,
}

const initialState: ITokenState = {
  address: '',
  burningRate: 0,
  initialSupply: 0,
  name: '',
  owner: '',
  presale: undefined,
  symbol: '',
  supply: 0,
  balance: 0,
}

// Reducer
type TokenAction =
  | { type: 'SET_ADDRESS'; payload: string }
  | { type: 'SET_BALANCE'; payload: number }
  | { type: 'SET_BURNING_RATE'; payload: number }
  | { type: 'SET_INITIAL_SUPPLY'; payload: number }
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_OWNER'; payload: string }
  | { type: 'SET_PRESALE'; payload: boolean }
  | { type: 'SET_SYMBOL'; payload: string }
  | { type: 'SET_SUPPLY'; payload: number }

const reducer = (state: ITokenState, action: TokenAction): ITokenState => {
  switch (action.type) {
    case 'SET_ADDRESS':
      return { ...state, address: action.payload }
    case 'SET_BALANCE':
      return { ...state, balance: action.payload }
    case 'SET_BURNING_RATE':
      return { ...state, burningRate: action.payload }
    case 'SET_INITIAL_SUPPLY':
      return { ...state, initialSupply: action.payload }
    case 'SET_NAME':
      return { ...state, name: action.payload }
    case 'SET_OWNER':
      return { ...state, owner: action.payload }
    case 'SET_PRESALE':
      return { ...state, presale: action.payload }
    case 'SET_SYMBOL':
      return { ...state, symbol: action.payload }
    case 'SET_SUPPLY':
      return { ...state, supply: action.payload }
  }
}

// Context
interface ITokenContext {
  state: ITokenState,
  endPresale: () => Promise<void>,
  transfer: (to: string, amount: string) => Promise<void>,
  allocate: (to: string, amount: string) => Promise<void>,
} 

const defaultContext: ITokenContext = {
  state: initialState,
  endPresale: async () => {},
  transfer: async (to: string, amount: string) => {},
  allocate: async (to: string, amount: string) => {},
}

const TokenContext = createContext<ITokenContext>(defaultContext);

// Context Provider
interface IProviderProps {
  children: React.ReactNode,
}

const TokenContextProvider: FC<IProviderProps> = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { account } = useEthereumState();

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(
    contractAddress.Burner,
    TokenArtifact.abi,
    provider.getSigner(0)
  );

  useEffect(() => {
    if (!account) return;

    getBalance();

    contract.on('Transfer', handleTransferEvent);

    return () => {
      contract.removeAllListeners('Transfer');
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const getBalance = async () => {
    if (!account) return;
    const balanceInWei = await contract.balanceOf(account);
    const balance = ethers.utils.formatEther(balanceInWei)
    dispatch({type: 'SET_BALANCE', payload: Number(balance)});
  };

  const handleTransferEvent = (from: string, to: string, value: number) => {
    if (to === ethers.constants.AddressZero) getSupply();
    if (account === from || account === to) getBalance();
  };

  useEffect(() => {
    getAddress();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAddress = async () => {
    dispatch({type: 'SET_ADDRESS', payload: contractAddress.Burner});
  };

  useEffect(() => {
    getBurningRate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getBurningRate = async () => {
    const burningRateX100000 = await contract.burningRate();
    const burningRate = burningRateX100000 / 100000;
    dispatch({type: 'SET_BURNING_RATE', payload: Number(burningRate)});
  };

  useEffect(() => {
    getInitialSupply();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getInitialSupply = async () => {
    const initialSupplyInWei = await contract.initialSupply();
    const initialSupply = ethers.utils.formatEther(initialSupplyInWei);
    dispatch({type: 'SET_INITIAL_SUPPLY', payload: Number(initialSupply)});
  };

  useEffect(() => {
    getName();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getName = async () => {
    const name = await contract.name();
    dispatch({type: 'SET_NAME', payload: name});
  };

  useEffect(() => {
    getOwner();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getOwner = async () => {
    const owner = await contract.owner();
    dispatch({type: 'SET_OWNER', payload: owner});
  };

  useEffect(() => {
    getPresale();

    contract.on('PresaleEnd', handlePresaleEndEvent);

    return () => {
      contract.removeAllListeners('PresaleEnd')
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPresale = async () => {
    const presale = await contract.presale();
    dispatch({type: 'SET_PRESALE', payload: presale});
  };

  const handlePresaleEndEvent = async () => {
    getPresale();
    getBurningRate();
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
    const supplyInWei = await contract.totalSupply();
    const supply = ethers.utils.formatEther(supplyInWei);
    dispatch({type: 'SET_SUPPLY', payload: Number(supply)});
  };

  const endPresale = async () => {
    await contract.endPresale();
  };

  const transfer = async (to: string, amount: string) => {
    const toAddress = ethers.utils.getAddress(to);
    const amountNumber = ethers.utils.parseUnits(amount);
    await contract.transfer(toAddress, amountNumber);
  };

  const allocate = async (to: string, amount: string) => {
    const toAddress = ethers.utils.getAddress(to);
    const amountNumber = ethers.utils.parseUnits(amount);
    await contract.allocate(toAddress, amountNumber);
  };

  return (
    <TokenContext.Provider
      value={{ state, endPresale, transfer, allocate }}
    >
      {children}
    </TokenContext.Provider>
  )
}

const useToken = () => useContext(TokenContext)
const useTokenState = () => useContext(TokenContext).state

export { TokenContextProvider, useToken, useTokenState }
