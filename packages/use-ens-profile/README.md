# use-ens-profile

React hook to get ens data. Automatically update name Use inside a web3-react provider.

```ts
const { name, avatarUrl } = useEnsProfile()
```

* `name` is either a trimmed address `0x1234...5678` or an ens domain `hello.eth`
* `avatarUrl` is either an http url pointing to the ens image or a metamask identicon (jazzicon)