import React from "react";

import './style.scss';

const NoWalletMessage: React.FC = () =>
  <div className="NoWalletMessage">
    <p>No Ethereum wallet was detected.</p>
    <p>Please install{" "}
      <a
        href="http://metamask.io"
        target="_blank"
        rel="noopener noreferrer"
      >
        MetaMask
      </a>
      .
    </p>
  </div>

export default NoWalletMessage;
