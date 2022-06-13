import React, { useState } from "react";

import { ethers } from "ethers";

import { useToken } from "./../../context/token-context";

import "./style.scss";

interface ITransferProps {
  isAllocation?: boolean,
}

// TODO: Do not mix transfer and allocate. Reuse inputs only.
const Transfer: React.FC<ITransferProps> = ({ isAllocation }) => {
  const { state, transfer, allocate } = useToken();
  const { balance, presale } = state;

  const [recipient, setRecipient] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  const isBalanceEnough = Number(amount) <= balance;
  const isAmountValid = !isNaN(Number(amount)) && Number(amount) > 0;
  const isRecipientValid = ethers.utils.isAddress(recipient);
  const isTransferEnabled =
    isBalanceEnough && isAmountValid && isRecipientValid;

  const isTransferSupported = isAllocation || (!presale && !isAllocation);

  const handleChangeRecipient = (e: React.FormEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    setRecipient(newValue);
  }

  const handleChangeAmount = (e: React.FormEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    setAmount(newValue);
  }

  const onTransfer = async () => {
    try {
      if (isAllocation) await allocate(recipient, amount);
      else await transfer(recipient, amount);
    }
    catch(e) {
      console.error(e);
    } 
    finally {
      setAmount("");
      setRecipient("");
    }
  }

  return(
    <div className="Transfer">
      <label htmlFor="to">Recipient:</label>
      <input
        type="text"
        id="to"
        name="to"
        placeholder="Enter recipient address"
        size={42}
        value={recipient}
        onChange={handleChangeRecipient}
        disabled={!isTransferSupported}
      />
      <label htmlFor="amount">Amount:</label>
      <input
        type="text"
        id="amount"
        name="amount"
        placeholder="Enter amount to send"
        value={amount}
        onChange={handleChangeAmount}
        disabled={!isTransferSupported}
      />
      <button type="button" onClick={onTransfer} disabled={!isTransferEnabled}>
        {isAllocation ? "Allocate" : "Transfer"}
      </button>
    </div>
  );
}

export default Transfer;
