import React, { useState } from "react";

import { ethers } from "ethers";

import { useToken } from "./../../context/token-context";

import "./style.scss";

const Transfer: React.FC = () => {
  const { state, transfer } = useToken();
  const { balance } = state;

  const [recipient, setRecipient] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  const isBalanceEnough = Number(amount) <= balance;
  const isAmountValid = !isNaN(Number(amount)) && Number(amount) > 0;
  const isRecipientValid = ethers.utils.isAddress(recipient);
  const isTransferEnabled =
    isBalanceEnough && isAmountValid && isRecipientValid;

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
      await transfer(recipient, amount);
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
      />
      <label htmlFor="amount">Amount:</label>
      <input
        type="text"
        id="amount"
        name="amount"
        placeholder="Enter amount to send"
        value={amount}
        onChange={handleChangeAmount}
      />
      <button type="button" onClick={onTransfer} disabled={!isTransferEnabled}>
        Transfer
      </button>
    </div>
  );
}

export default Transfer;
