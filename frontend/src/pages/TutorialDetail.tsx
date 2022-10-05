import React, { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"

const loginTutorialContents = [
  {
    image: "/images/tutorial/login/login1.png",
    text: "1. 크롬 웹스토어에서 메타마스크를 다운받으세요",
  },
  {
    image: "/images/tutorial/login/login2.png",
    text: "2. 메타마스크에 가입하세요",
  },
  {
    image: "/images/tutorial/login/login3.png",
    text: "3. 어떤 설명을 할까요",
  },
  {
    image: "/images/tutorial/login/login4.png",
    text: "4. Ropsten 네트워크를 연결하세요",
  },
  {
    image: "/images/tutorial/login/login5.png",
    text: "5. Ropsten testnet에서 이더를 받으세요 -> https://faucet.egorfine.com/",
  },
  {
    image: "/images/tutorial/login/login6.png",
    text: "6. 최초 회원가입하여 10000 MUNG을 받으세요!",
  },
]

const gameTutorialContents = [
  {
    image: "game/game1.png",
    text: `1. 게임 시작하기를 누르면 아기 강아지 모드와 웨딩 모드를 선택하실 수 있습니다. 아기 강아지 모드는 모든 스탯이 0부터 시작하며 게임 플레이를 위해 100 MUNG을 지불해야 합니다. 웨딩 모드는 현재 플레이어가 보유중인 NFT들 중 남성과 여성을 조합하여 향상된 스탯을 가지고 시작하며 NFT 등급에 따라 가격이 달라집니다.`,
  },
  {
    image: "game/game2.png",
    text: "2. 게임을 시작하기 전 게임머니를 입력하려면 메타마스크 승인을 진행해주세요.",
  },
  {
    image: "game/game3.png",
    text: "3. 선택지를 선택하며 강아지의 능력치를 올릴 수 있습니다.",
  },
  {
    image: "game/game4.png",
    text: "4. 게임이 끝난 후 NFT 민팅하기를 진행하여 플레이어만의 NFT를 만들 수 있습니다. 엔딩 크레딧을 보며 메타마스크 승인을 진행해주세요.",
  },
]

const tradeTutorialContents = [
  {
    image: "trade/trade1.png",
    text: "1. 마이페이지 및 강아지 구경의 NFT 목록에서 본인의 NFT 사진을 클릭하면 판매를 등록할 수 있습니다. 판매 등록을 진행하려면 즉시 구매 가격과 제안 여부를 설정해주세요. 다음 메타마스크 승인을 진행해주세요.",
  },
  {
    image: "trade/trade2.png",
    text: "2. 판매를 중지하려면 판매 중인 NFT 의 판매중지 버튼을 눌러 메타마스크 승인을 진행해주세요.",
  },
  {
    image: "trade/trade3.png",
    text: "3. NFT 구매 방법은 즉시구매와 제안 2가지가 있습니다. 즉시구매는 판매자가 설정한 가격을 지불하여 즉시 구매를 하는 방법입니다. 제안은 판매자에게 가격을 제안하여 판매자가 요청을 승인하게 되면 NFT를 얻는 방법입니다. 제안 또한 즉시구매와 마찬가지로 MUNG을 지불하여 제안합니다.",
  },
  {
    image: "trade/trade4.png",
    text: "4. 본인이 했던 제안을 취소하려면 NFT의 제안 이력의 ❌ 버튼을 클릭 후 메타마스크 승인을 진행해주세요.",
  },
  {
    image: "trade/trade5.png",
    text: "3. 만약 제안했던 NFT를 다른 이용자가 구매를 하면 제안할때 본인이 지불했던 가격을 환불 받을 수 있습니다. 환불을 받으려면 마이페이지의 제안 내역 탭을 클릭 후 오퍼 상태가 환불 가능인 것을 찾아 클릭후 메타마스크 승인을 진행해주세요.",
  },
]

const TutorialDetail = () => {
  const { pathname } = useLocation()
  const [clickedImage, setClickedImage] = useState("")
  const [clickedText, setClickedText] = useState("")

  return (
    <div
      className="flex w-full h-full rounded-lg shadow-md bg-beige-400 mapleStory text-brown-500"
      style={{ scrollBehavior: "smooth" }}
    >
      <div className="h-full w-[256px] p-2 grid grid-cols-1 gap-y-2 overflow-y-auto scrollbar-hide">
        {pathname === "/tutorial-detail/1" &&
          loginTutorialContents.map(({ image, text }, index) => {
            return (
              <div
                className="w-[240px] h-[135px] mb-[20px] cursor-pointer rounded-lg hover:scale-105 ease-in-out transition delay-150 shadow-lg"
                key={index}
                onClick={async () => {
                  await setClickedImage(image)
                  await setClickedText(text)
                }}
              >
                <img
                  src={`/images/tutorial/${image}`}
                  alt="튜토리얼 이미지"
                  className="rounded-lg"
                />
              </div>
            )
          })}
        {pathname === "/tutorial-detail/2" &&
          gameTutorialContents.map(({ image, text }, index) => {
            return (
              <div
                className="w-[240px] h-[135px] mb-[20px] cursor-pointer rounded-lg hover:scale-105 ease-in-out transition delay-150 shadow-lg"
                key={index}
                onClick={async () => {
                  await setClickedImage(image)
                  await setClickedText(text)
                }}
              >
                <img
                  src={`/images/tutorial/${image}`}
                  alt="튜토리얼 이미지"
                  className="rounded-lg border-transparent border-2"
                />
              </div>
            )
          })}

        {pathname === "/tutorial-detail/3" &&
          tradeTutorialContents.map(({ image, text }, index) => {
            return (
              <div
                className="w-[240px] h-[135px] mb-[20px] cursor-pointer rounded-lg hover:scale-105 ease-in-out transition delay-150 border-2 border-transparent"
                key={index}
                onClick={async () => {
                  await setClickedImage(image)
                  await setClickedText(text)
                }}
              >
                <img
                  src={`/images/tutorial/${image}`}
                  alt="튜토리얼 이미지"
                  className="rounded-lg border-transparent border-2"
                />
              </div>
            )
          })}
      </div>

      {clickedText ? (
        <div className="w-[738px] h-full p-4">
          <div className="flex justify-center items-center w-full h-[70%] rounded-lg border-2 border-transparent">
            <img src={`/images/tutorial/${clickedImage}`} alt="" />
          </div>

          <div className="flex w-full h-[30%] border-2 mt-2 border-brown-200 rounded-lg p-4">
            <p>{clickedText}</p>
          </div>
        </div>
      ) : pathname === "/tutorial-detail/1" ? (
        <div className="w-[738px] h-full p-4">
          <div className="flex justify-center items-center w-full h-[70%] rounded-lg border-2 border-transparent">
            <img
              src={`/images/tutorial/${loginTutorialContents[0].image}`}
              alt=""
              className="border-2 border-transparent rounded-lg"
            />
          </div>

          <div className="flex w-full h-[30%] border-2 mt-2 border-brown-200 rounded-lg p-4">
            <p>{loginTutorialContents[0].text}</p>
          </div>
        </div>
      ) : pathname === "/tutorial-detail/2" ? (
        <div className="w-[738px] h-full p-4">
          <div className="flex justify-center items-center w-full h-[70%] rounded-lg border-2 border-transparent">
            <img
              src={`/images/tutorial/${gameTutorialContents[0].image}`}
              alt=""
              className="border-2 border-transparent rounded-lg"
            />
          </div>

          <div className="flex w-full h-[30%] border-2 mt-2 border-brown-200 rounded-lg p-4">
            <p>{gameTutorialContents[0].text}</p>
          </div>
        </div>
      ) : pathname === "/tutorial-detail/3" ? (
        <div className="w-[738px] h-full p-4">
          <div className="flex justify-center items-center w-full h-[70%] rounded-lg ">
            <img
              src={`/images/tutorial/${tradeTutorialContents[0].image}`}
              alt=""
            />
          </div>

          <div className="flex w-full h-[30%] border-2 mt-2 border-brown-200 rounded-lg p-4">
            <p>{tradeTutorialContents[0].text}</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default TutorialDetail
