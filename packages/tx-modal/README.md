# tx-modal

Render a modal that shows every step of a transaction

```tsx
const MyComponent: React.FC = () => {
  const { txState, execTransaction, reset } = useContractTx()
  
  const run = async () => {
    await execTransaction(() => {
      //...
    })
  }

  return <>
    <TxModal txState={txState} done={reset} />
    <button onClick={run}>Run tx</button>
  </>
}
```