import React from "react"
import type { NextPage } from "next"
import Head from "next/head"
import Navbar from "@/components/navbar"
import { useMetaMask } from "@calypso/lib"

const Home: NextPage = () => {
  const {
    hasProvider,
    connect,
    wallet,
    error,
    errorMessage,
    isConnecting,
    isMetaMask,
  } = useMetaMask()

  React.useEffect(() => {
    console.log(wallet)
  }, [wallet])
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-full w-full flex-col items-center">
        <Navbar />
        {hasProvider && <button onClick={connect}>Connect MetaMask</button>}
        <p>{isMetaMask ? "Yeees, you can connect" : "Downlaod MetaMask"}</p>
      </main>
    </>
  )
}

export default Home
