import { useState } from "react";
import { TransactionReceipt } from "@ethersproject/providers";
import { ContractTransaction, ContractReceipt } from "@ethersproject/contracts";
import {
  TxState,
  txOutIdle,
  txOutPendingSig,
  txOutError,
  txInStatePending,
  txInStateReverted,
  txInStateSuccess,
} from "./state";
import { ContractErrors, getErrorMessage } from "./get-error-message";

export const useContractTx: () => {
  txState: TxState;
  execTransaction: (
    txRun: () => Promise<ContractTransaction>,
    errors?: ContractErrors | undefined,
    postTxHook?:
      | ((tx: ContractTransaction, receipt: TransactionReceipt) => void)
      | undefined
  ) => Promise<void>;
  reset: () => void;
} = () => {
  const [txState, setTxState] = useState<TxState>(txOutIdle());

  const reset = () => {
    setTxState(txOutIdle());
  };

  const execTransaction = async (
    txRun: () => Promise<ContractTransaction>,
    errors?: ContractErrors,
    postTxHook?: (tx: ContractTransaction, receipt: TransactionReceipt) => void
  ) => {
    setTxState(txOutPendingSig());

    let tx: ContractTransaction;
    try {
      tx = await txRun();
    } catch (err) {
      setTxState(txOutError(getErrorMessage(err, errors || {})));
      return;
    }

    setTxState(txInStatePending(tx.hash));

    let receipt: ContractReceipt;
    try {
      receipt = await tx.wait();
    } catch (err) {
      txInStateReverted(tx.hash, getErrorMessage(err, errors || {}));
      return;
    }

    setTxState(txInStateSuccess(tx.hash));

    if (postTxHook) {
      postTxHook(tx, receipt);
    }
  };

  return { txState, execTransaction, reset };
};
