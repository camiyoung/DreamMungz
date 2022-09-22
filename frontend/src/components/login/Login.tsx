import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { http } from "../../api/axios"
import { chainId, MUNGContract } from "../../utils/Web3Config"
import Web3 from "web3"

// Nickname을 전역변수로 넣기 위한 import문
import memberAtom from "../../recoil/member/atom"
import { useRecoilState } from "recoil"

export default function Login() {
  const [, setNickname] = useRecoilState(memberAtom)

  const navigate = useNavigate()
  let web3: any

  const handleAuthenticate = ({
    publicAddress,
    signature,
  }: {
    publicAddress: string
    signature: string
  }) => {
    const data = { address: publicAddress, signature: signature }
    http.post(`auth/signature`, data).then((res) => {
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("expiration", res.data.expiration)
    })
  }

  const handleSignMessage = async ({
    publicAddress,
    nonce,
  }: {
    publicAddress: string
    nonce: string
  }) => {
    try {
      const signature = await web3!.eth.personal.sign(nonce, publicAddress, "")
      return { publicAddress, signature }
    } catch (err: any) {
      throw new Error("You need to sign the message to be able to log in.")
    }
  }

  const handleSignup = (publicAddress: string) => {
    http
      .post("auth/signin", {
        params: {
          address: publicAddress,
        },
      })
      .then((res) => res.data.nonce)
  }

  // 네트워크 연결 함수
  const handleNetwork = async (chainId: number) => {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: web3.utils.toHex(chainId) }],
    })
  }

  const handleClick = async () => {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      window.alert("Please install MetaMask first.")
      return
    }
    if (!web3) {
      try {
        // Request account access if needed
        await window.ethereum.enable()

        // We don't know window.web3 version, so we use our own instance of Web3
        // with the injected provider given by MetaMask
        web3 = new Web3(window.ethereum)
      } catch (error) {
        window.alert("You need to allow MetaMask.")
        return
      }
    }

    const coinbase = await web3.eth.getCoinbase()
    if (!coinbase) {
      window.alert("Please activate MetaMask first.")
      return
    }

    const publicAddress = coinbase.toLowerCase()

    let nonce

    // Look if user with current publicAddress is already present on backend
    const first = await http
      .get(`auth/info/${publicAddress}`)
      .then((res) => res.data.nonce)
      .catch((err) => err.response.data.message)

    // 존재하면 exception의 에러메시지
    if (first !== "존재하지 않는 회원입니다.") {
      nonce = first
    } else {
      nonce = await handleSignup(publicAddress)
    }

    // 회원 닉네임 전역변수에 저장
    http.get(`auth/info/nickname/${publicAddress}`).then((res) => {
      // walletAddress, memberNickname recoil 전역변수에 저장
      setNickname((prev) => {
        const value = { ...prev }
        value.memberNickname = res.data.data.nickname
        value.walletAddress = publicAddress
        return value
      })
    })

    // Popup MetaMask confirmation modal to sign message
    const third = await handleSignMessage({ publicAddress, nonce })

    // Send signature to backend on the /auth route
    await handleAuthenticate(third)

    const accounts = await window.ethereum.request({ method: "eth_accounts" })
    await handleNetwork(chainId)

    // 회원가입을 했는지 확인
    await http
      .get(`https://j7a605.p.ssafy.io/api/auth/duplicated/${publicAddress}`)
      .then((res) => {
        // 첫 회원가입
        if (res.data === false) {
          window.alert("최초가입하셨네요! 만원을 지급해드립니다!")

          // 여기에 코드 추가해야 함 await
          MUNGContract.methods
            .mintToNewMember(publicAddress)
            .send({ from: publicAddress })
        }
      })

    // Spinner 넣기

    navigate("/mainpage")
    try {
    } catch (err) {
      window.alert(err)
    }
  }

  return (
    <div>
      <button
        className="Login-button Login-mm flex items-center border bg-[#273850] p-2"
        onClick={handleClick}
      >
        <img
          src="images/metamask.png"
          className="mr-1"
          alt="Metamask 로그인 이미지"
        />
        <p className="font-semibold text-white">MetaMask 로그인</p>
      </button>
    </div>
  )
}