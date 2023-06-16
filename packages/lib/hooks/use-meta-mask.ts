import { useEffect, useState } from "react"
import detectEthereumProvider from "@metamask/detect-provider"

import { formatBalance } from "../formatBalance"

declare global {
  interface Window {
    ethereum: any
  }
}

interface Meta {
  account: string[]
  balance: string
  chainId: string
}

export function useMetaMask() {
  const initialState: Meta = { account: [], balance: "", chainId: "" }

  const [hasProvider, setHasProvider] = useState<boolean | null>(null)
  const [wallet, setWallet] = useState<Meta>(initialState)
  const [isMetaMask, setIsMetaMask] = useState<boolean | null>(null)

  const [isConnecting, setIsConnecting] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    const refreshAccount = (account: any) => {
      if (account.length > 0) {
        updateWallet(account)
      } else {
        setWallet(initialState)
      }
    }

    const refreshChain = (chainId: any) => {
      setWallet((wallet) => ({ ...wallet, chainId }))
    }
    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true })
      setHasProvider(Boolean(provider))

      if (provider && window.ethereum.isMetaMask) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        })
        refreshAccount(accounts)
        setIsMetaMask(true)
        window.ethereum.on("accountsChanged", refreshAccount)
        window.ethereum.on("chainChanged", refreshChain)
      }
    }

    getProvider()

    return () => {
      window.ethereum?.removeListener("accountsChanged", refreshAccount)
      window.ethereum?.removeListener("chainChanged", refreshChain)
    }
  }, [])

  const updateWallet = async (account: any) => {
    const balance = formatBalance(
      await window.ethereum!.request({
        method: "eth_getBalance",
        params: [account[0], "latest"],
      }),
    )
    const chainId = await window.ethereum!.request({
      method: "eth_chainId",
    })
    setWallet({ account, balance, chainId })
  }

  const connect = async () => {
    setIsConnecting(true)
    await window.ethereum
      .request({
        method: "eth_requestAccounts",
      })
      .then((account: []) => {
        setError(false)
        updateWallet(account)
      })
      .catch((err: any) => {
        setError(true)
        setErrorMessage(err.message)
      })
    setIsConnecting(false)
  }

  return {
    hasProvider,
    isMetaMask,
    connect,
    wallet,

    isConnecting,
    error,
    errorMessage,
  }
}
