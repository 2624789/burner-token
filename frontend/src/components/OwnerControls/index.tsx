import React from "react";

import { useToken } from "./../../context/token-context";

import './style.scss';

const OwnerControls: React.FC = () => {
  const { state, endPresale } = useToken();
  const { presale } = state;

  return(
    <div className="OwnerControls">
      <fieldset>
        <legend>Owner Controls</legend>
        <button type="button" onClick={endPresale} disabled={!presale}>
          End Presale
        </button>
      </fieldset>
    </div>
  );
}

export default OwnerControls;
