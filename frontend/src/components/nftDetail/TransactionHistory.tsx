import React from "react"

const tradeList: any = [
  {
    url: "image_url",
    type: "BUY",
    sellerNickname: "df2de2",
    sellerAddress: "0x34234f3r324234",
    date: "yyyy-mm-dd",
    price: 12,
    tradeList: [
      {
        sellerNickname: "asd",
        sellerAddress: "0x1232wsdf32r",
        buyerNickname: "sdfsdf",
        buyerAddress: "0x1232dfjsiodf",
        date: "2022-08-15", // 거래했던 날짜
        price: 123,
      },
      {
        sellerNickname: "asdsfd",
        sellerAddress: "0x123asdasfdsfsdf32r",
        buyerNickname: "sdfsdf",
        buyerAddress: "0x134dfjsiodf",
        date: "2021-08-15", // 거래했던 날짜
        price: 120,
      },
      {
        sellerNickname: "123123",
        sellerAddress: "0x346sdf32r",
        buyerNickname: "cxvdsff",
        buyerAddress: "0x654fjsiodf",
        date: "2022-08-17", // 거래했던 날짜
        price: 100,
      },
    ],
    offerList: [
      {
        id: 1,
        buyerAddress: "buy1",
        buyerNickname: "HeyHi",
        price: 70,
        date: "offerdate",
      },
      {
        id: 2,
        buyerAddress: "buy2",
        buyerNickname: "wer",
        price: 60,
        date: "offerdate",
      },
      {
        id: 3,
        buyerAddress: "buy4",
        buyerNickname: "Byeee",
        price: 65,
        date: "offerdate",
      },
    ],
  },
]

interface TradeListProp {
  sellerNickname: string
  sellerAddress: string
  buyerNickname: string
  buyerAddress: string
  date: string
  price: number
}

export default function TransactionHistory() {
  return (
    <div className="w-[47.5%] border rounded-lg border-black">
      <p className="text-xl font-semibold ml-2">거래 이력</p>
      <div className="w-full h-[90%] bg-transparent p-2">
        <div className="flex w-full border border-b-black border-t-transparent border-l-transparent border-r-transparent">
          <p className="w-[20%]">가격</p>
          <p className="w-[20%]">From</p>
          <p className="w-[30%]">To</p>
          <p>Date</p>
        </div>
        {tradeList[0]?.tradeList.map(
          (
            {
              sellerNickname,
              sellerAddress,
              buyerNickname,
              buyerAddress,
              date,
              price,
            }: TradeListProp,
            idx: number
          ) => {
            return (
              <div key={idx}>
                <ul className="flex py-1">
                  <li className="w-[20%]">{price}</li>

                  {/* 마이페이지 가게 만들기 */}
                  <li
                    className="w-[20%] text-lgBrown-600
 hover:text-lgBrown-700 cursor-pointer"
                    onClick={() => {}}
                  >
                    {sellerNickname}
                  </li>
                  {/* 마이페이지 가게 만들기 */}
                  <li
                    className="w-[30%] text-lgBrown-600
 hover:text-lgBrown-700 cursor-pointer"
                    onClick={() => {}}
                  >
                    {buyerNickname}
                  </li>
                  <li>{date}</li>
                </ul>
              </div>
            )
          }
        )}
      </div>
    </div>
  )
}
