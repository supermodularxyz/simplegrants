import React from "react";
import Image from "next/image";
import { GrantResponse } from "../types/grant";
import FundingBar from "./Progress";

interface ICardProps {
  grant: GrantResponse;
  onClick?: () => any;
}

const Card = ({ grant, onClick }: ICardProps) => (
  <div
    className="flex flex-col w-full min-w-[240px] lg:min-w-[350px] max-w-[350px] bg-white rounded-lg overflow-hidden cursor-pointer shadow-card"
    key={grant.id}
    onClick={onClick}
  >
    <div className="relative w-full aspect-[5/3] h-full max-h-[210px]">
      <Image alt={grant.name} src={grant.image} fill className="aspect-[5/3]" />
    </div>
    <div className="flex flex-col px-8 py-6 h-full items-start justify-between">
      <div className="flex flex-col">
        <p className="font-bold text-[22px]">{grant.name}</p>
        <p className="text-sg-700">by User</p>
        <p className="text-sm mt-4 overflow-hidden text-ellipsis max-h-16">
          {grant.description}
        </p>
      </div>
      <div className="flex flex-col w-full mt-8">
        <FundingBar
          value={grant.amountRaised}
          max={grant.fundingGoal}
          className="mb-3"
        />
        <p className="font-bold text-lg">
          ${" "}
          {grant.amountRaised.toLocaleString("en-US", {
            maximumFractionDigits: 0,
          })}{" "}
          / {((grant.amountRaised / grant.fundingGoal) * 100).toFixed(0)}%
          funded
        </p>
      </div>
    </div>
  </div>
);

export default Card;
