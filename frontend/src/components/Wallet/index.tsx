import React from "react";

import { useTokenState } from "./../../context/token-context";

const Wallet: React.FC = () => {
  const { balance } = useTokenState();

  return(
    <div className="Wallet">
      <div className="Container">
        <div className="Card">
          <p><span className="fixed-text">Balance:</span> {balance.toLocaleString('en')}</p>
        </div>
      </div>
    </div>
  );
}

export default Wallet;
