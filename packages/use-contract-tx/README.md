# use-contract-tx

React hook that models the execution of an ethereum transaction into 6 stages.

```
Idle -> PendingSig --------> Pending -------- Success
                   \                 \
                     --> Error X       --> Reverted
```

The hook returns an object with one property and two methods:

```ts
const { txState, execTransaction, reset } = useContractTx();
```

* `txState` is the current state of the transaction. There are 6 possible states [explained below](#TxStates). You can use this property to render the appropriate UI
* `execTransaction` is a function that takes 3 arguments 
  * `txRun: () => Promise<ContractTransaction>` in this function you should return the `ContractTransaction` promise that you get when running an ethersjs contract transaction
  * `errors` a property that is a map from a custom error signature an object with the following interface `{name: "MyCustomError", message: "Error explanation to show in txState.message"}`
  * `postTxHook: (tx: ContractTransaction, receipt: TransactionReceipt) => void` this is a callback that runs after the transaction is mined and successful
* `reset` is a function that resets `txState` to `TxOutIdle` state

### Example

```tsx
const MyComponent: React.FC = () => {
  const { txState, execTransaction, reset } = useContractTx();
  
  const run = async () => {
    await execTransaction(() => {
      // ... create a Contract using ethers.js
      // execute the transaction method
      return contract.myMethod()
    })
  }

  switch (txState.discriminator) {
    case TxOutStateDiscriminator.Idle:
      return <button onClick={run}>
        Run tx
      </button>

    case TxOutStateDiscriminator.PendingSig:
      return <div>Waiting signature...</div>

    case TxOutStateDiscriminator.Error:
      return <div>Error: {txState.message}</div>

    case TxInStateDiscriminator.Pending:
      return <div>
        Transaction pending...
        <br/>
        {tx.hash}
      </div>

    case TxInStateDiscriminator.Error:
      return <div>
        Error: {txState.message}
        <br/>
        {tx.hash}
      </div>

    case TxInStateDiscriminator.Success:
      return <div>
        Transaction successful!
        <br/>
        {tx.hash}
        <br/>
        <button onClick={reset}>Try again</button>
      </div>
  }
};
```

### TxStates

`TxState` is divided into `TxOuState` which is when the tx was not yet sent to an ethereum node, and `TxInState` which is after the tx is sent to an ethereum node.

Every state has a discriminator and may have other properties so you can use it like `{ txState.discriminator === TxInStateDiscriminator.Error && txState.hash}` in your component and render the appropriate ui. Every `TxInState` has the `hash` property and the 2 error states have the `message` property with info about the error that happened.

| type | discriminator | description |
| - | - | - |
| `TxOutIdle` | `TxOutStateDiscriminator.Idle` | No transaction initiated |
| `TxOutPendingSig` | `TxOutStateDiscriminator.PendingSig` | Requested transaction approval to wallet |
| `TxOutError` | `TxOutStateDiscriminator.Error` | Requested transaction approval, but wallet returned an error. This could be because the transaction will fail or because the user rejected the transaction request. This state has the property `message` with information about the error |
| `TxInPending` | `TxInStateDiscriminator.Pending` | Transaction sent to ethereum and waiting to be mined |
| `TxInError` | `TxInStateDiscriminator.Error` | Transaction was mined and reverted. This state has the property `message` with information about the error |
| `TxInSuccess` | `TxInStateDiscriminator.Success` | Transaction was mined and did not revert |