import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import findKOR from "../../utils/findKOR"

export default function NftMainDetail(info: any) {
  const navigate = useNavigate()
  return (
    <div>
      <p className="text-xl font-semibold">
        직업: {findKOR(info.info.nft.job)}
      </p>
      <p className="text-xl font-semibold">
        성별: {findKOR(info.info.nft.gender)}
      </p>
      <p className="text-xl font-semibold">Tags</p>
      <div className="flex">
        {info.info.nft.status.map((res: any, index: number) => {
          return (
            <p
              key={index}
              className="border border-pink-500
      pr-2"
            >
              {findKOR(res.name)} {res.value}
            </p>
          )
        })}
      </div>
      <p className="text-xl font-semibold">
        등급: {findKOR(info.info.nft.tier)}
      </p>
      {info.info.sell === true ? (
        <div>
          <div className="flex">
            <p className="text-xl font-semibold mr-1">분양자: </p>
            <p
              className="text-xl font-semibold cursor-pointer hover:text-lgBrown-500
              "
              onClick={() => {
                navigate(`/personal/${info.info.sellerAddress}/list`)
              }}
            >
              {info.info.sellerNickname}
            </p>
          </div>
          <p className="text-xl font-semibold">{info.info.price} M</p>
        </div>
      ) : (
        <div>
          <p className="text-xl font-semibold">
            보유자: {findKOR(info.info.sellerNickname)}
          </p>
        </div>
      )}
    </div>
  )
}