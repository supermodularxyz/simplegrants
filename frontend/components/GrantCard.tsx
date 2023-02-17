import React from "react";
import Image from "next/image";
import { GrantResponse } from "../types/grant";
import FundingBar from "./Progress";
import { useCartStore } from "../utils/store";
import Button from "./Button";

interface IGrantCardProps {
  grant: GrantResponse;
  onClick?: (e?: any) => any;
}

const GrantCard = ({ grant, onClick }: IGrantCardProps) => {
  const { grants, addToCart, removeFromCart } = useCartStore();

  const addedToCart = React.useMemo(
    () => grants.find((data) => data.id === grant.id),
    [grants, grant]
  );

  return (
    <div
      className="flex flex-col w-full min-w-[240px] lg:min-w-[350px] max-w-[350px] bg-white rounded-lg overflow-hidden cursor-pointer shadow-card"
      key={grant.id}
      onClick={onClick}
    >
      <div className="relative w-full aspect-[5/3] h-full max-h-[210px]">
        <Image
          alt={grant.name}
          src={grant.image}
          fill
          className="aspect-[5/3]"
        />
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
          <p className="font-bold text-lg mb-3">
            ${" "}
            {grant.amountRaised.toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })}{" "}
            / {((grant.amountRaised / grant.fundingGoal) * 100).toFixed(0)}%
            funded
          </p>
          {addedToCart ? (
            <Button
              className="w-full btn-error"
              onClick={(e) => {
                e.stopPropagation();
                removeFromCart(grant.id);
              }}
            >
              Remove from cart
            </Button>
          ) : (
            <Button
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(grant);
              }}
            >
              Add to cart
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GrantCard;
