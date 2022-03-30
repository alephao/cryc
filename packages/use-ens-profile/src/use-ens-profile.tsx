import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'
const jazzicon = require('@metamask/jazzicon')

const trimmedAddress: (account: string) => string = (account) => {
  const start = account.slice(0, 6)
  const end = account.slice(38, 42)
  return [start, '...', end].join('')
}

const makeIdentiicon = (wallet: string) => {
  const addr = wallet.slice(2, 10)
  const seed = parseInt(addr, 16)
  const el = jazzicon(28, seed) as HTMLElement
  const svgNode = el.childNodes[0] as SVGElement
  svgNode.style.background = el.style.background
  const s = new XMLSerializer().serializeToString(svgNode)
  const encoded = window.btoa(s)
  return 'data:image/svg+xml;base64,' + encoded
}

const fetchEnsAvatar = async (ens: string) => {
  const url = `http://metadata.ens.domains/mainnet/avatar/${ens}?v=1.0`
  const resp = await fetch(url)
  if (resp.headers.get('content-type') === 'image/png') {
    return url
  }
  return null
}

const fetchMetadata = async (web3: Web3Provider, wallet: string) => {
  const ens = await web3.lookupAddress(wallet)
  if (ens) {
    let truncatedEns = ens
    if (ens.length > 23) {
      truncatedEns = ens.slice(0, 20) + '...'
    }
    const ensAvatarUrl = await fetchEnsAvatar(ens)
    if (ensAvatarUrl) {
      return { name: truncatedEns, avatarUrl: ensAvatarUrl }
    }
    return { name: truncatedEns, avatarUrl: makeIdentiicon(wallet) }
  }
  return { name: trimmedAddress(wallet), avatarUrl: makeIdentiicon(wallet) }
}

export const useEnsProfile = () => {
  const { account, library } = useWeb3React<Web3Provider>()

  const [name, setName] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  const asyncEffect = async () => {
    if (library && account) {
      const { name, avatarUrl } = await fetchMetadata(library, account)
      setName(name)
      setAvatarUrl(avatarUrl)
    }
  }

  useEffect(() => {
    asyncEffect()
  }, [account, library])

  return { name, avatarUrl }
}