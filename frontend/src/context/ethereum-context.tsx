import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useReducer
} from 'react';
import detectEthereumProvider from '@metamask/detect-provider';

const CHAIN_NAMES: {[key: string]: string}  = {
  "0x1": "Mainnet",
  "0x2a": "Kovan",
  "0x3": "Ropsten",
  "0x4": "Rinkeby",
  "0x5": "Goerli",
  "0x539": "Hardhat",
  "0x38": "Binance"
}

type EthAction =
  | { type: 'SET_ACCOUNT'; payload: string }
  | { type: 'SET_CHAIN'; payload: string }
  | { type: 'SET_PROVIDER'; payload: object|unknown }

interface IEthState {
  account: string,
  chain: string,
  provider: object|unknown,
}

const initialState: IEthState = {
  account: "",
  chain: "",
  provider: {},
}

const reducer = (state: IEthState, action: EthAction): IEthState => {
  switch (action.type) {
    case 'SET_ACCOUNT':
      return { ...state, account: action.payload }
    case 'SET_CHAIN':
      return { ...state, chain: action.payload }
    case 'SET_PROVIDER':
      return { ...state, provider: action.payload }
  }
}

interface IEthContext {
  state: IEthState,
  connect: () => Promise<void>,
} 

const defaultContext: IEthContext = {
  state: initialState,
  connect: async () => {},
}

const EthereumContext = createContext<IEthContext>(defaultContext);

interface IProviderProps {
  children: React.ReactNode,
}

const EthereumContextProvider: FC<IProviderProps> = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { provider, account } = state;

  useEffect(() => {
    getProvider();
  }, []);

  const getProvider = async () => {
    const provider = await detectEthereumProvider();
    dispatch({type: 'SET_PROVIDER', payload: provider});
  };

  useEffect(() => {
    if(provider && provider === window.ethereum) {
      getChain();
      window.ethereum.on("chainChanged", handleChainChanged);
      getAccount();
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    } 
    if(provider && provider !== window.ethereum) {
      console.error("Something is overwriting provider.");
    }

    return () => {
      if(window.ethereum) {
        window.ethereum.removeListener("chainChanged", handleChainChanged);
        window.ethereum.removeListener(
          "accountsChanged", handleAccountsChanged);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  const getChain = async () => {
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    handleChainChanged(chainId);
  };

  const handleChainChanged = (chainId: string) => {
    dispatch({type: 'SET_CHAIN', payload: CHAIN_NAMES[chainId]});
  };

  const getAccount = async () => {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    handleAccountsChanged(accounts);
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0)
      dispatch({type: 'SET_ACCOUNT', payload: ""});
    else if (accounts[0] !== account)
      dispatch({type: 'SET_ACCOUNT', payload: accounts[0]});
  };

  const connect = async () => {
    const accounts =
      await window.ethereum.request({ method: "eth_requestAccounts" });
    handleAccountsChanged(accounts);
  };

  return (
    <EthereumContext.Provider
      value={{ state, connect }}
    >
      {children}
    </EthereumContext.Provider>
  )
}

const useEthereum = () => useContext(EthereumContext)
const useEthereumState = () => useContext(EthereumContext).state

export { EthereumContextProvider, useEthereum, useEthereumState }
