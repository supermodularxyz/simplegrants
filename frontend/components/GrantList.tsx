import React from "react";
import Image from "next/image";
import { GrantResponse } from "../types/grant";
import FundingBar from "./Progress";
import { useCartStore } from "../utils/store";
import Button from "./Button";

interface IGrantListProps {
  grant: GrantResponse;
  onClick?: (e?: any) => any;
}

const GrantList = ({ grant, onClick }: IGrantListProps) => {
  const { grants, addToCart, removeFromCart } = useCartStore();

  const addedToCart = React.useMemo(
    () => grants.find((data) => data.id === grant.id),
    [grants, grant]
  );

  return (
    <div
      className="flex flex-row w-full h-full bg-white shadow-card py-8 px-6 rounded-lg gap-x-6 cursor-pointer"
      key={grant.id}
      onClick={onClick}
    >
      <div className="overflow-hidden rounded-lg aspect-[5/3] h-full max-w-xs w-full relative flex-none">
        <Image
          src={grant.image}
          fill
          className="aspect-[5/3]"
          alt={grant.name}
        />
      </div>
      <div className="flex flex-col w-full h-full justify-between">
        <div className="flex flex-col mb-4">
          <p className="font-bold text-xl mb-2">{grant.name}</p>
          <p className="leading-relaxed line-clamp-3">{grant.description}</p>
        </div>
        <div className="flex flex-col">
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
      {addedToCart ? (
        <Button
          className="flex-none w-max h-max btn-error"
          onClick={(e) => {
            e.stopPropagation();
            removeFromCart(grant.id);
          }}
        >
          Remove from cart
        </Button>
      ) : (
        <Button
          className="flex-none w-max h-max"
          onClick={(e) => {
            e.stopPropagation();
            addToCart(grant);
          }}
        >
          Add to cart
        </Button>
      )}
    </div>
    // <div
    //   className="flex flex-col w-full min-w-[240px] lg:min-w-[350px] max-w-[350px] bg-white rounded-lg overflow-hidden cursor-pointer shadow-card"
    //   key={grant.id}
    //   onClick={onClick}
    // >
    //   <div className="relative w-full aspect-[5/3] h-full max-h-[210px]">
    //     <Image
    //       alt={grant.name}
    //       src={grant.image}
    //       fill
    //       className="aspect-[5/3]"
    //     />
    //   </div>
    //   <div className="flex flex-col px-8 py-6 h-full items-start justify-between">
    //     <div className="flex flex-col">
    //       <p className="font-bold text-[22px]">{grant.name}</p>
    //       <p className="text-sg-700">by User</p>
    //       <p className="text-sm mt-4 overflow-hidden text-ellipsis max-h-16">
    //         {grant.description}
    //       </p>
    //     </div>
    //     <div className="flex flex-col w-full mt-8">
    //       <FundingBar
    //         value={grant.amountRaised}
    //         max={grant.fundingGoal}
    //         className="mb-3"
    //       />
    //       <p className="font-bold text-lg mb-3">
    //         ${" "}
    //         {grant.amountRaised.toLocaleString("en-US", {
    //           maximumFractionDigits: 0,
    //         })}{" "}
    //         / {((grant.amountRaised / grant.fundingGoal) * 100).toFixed(0)}%
    //         funded
    //       </p>

    //     </div>
    //   </div>
    // </div>
  );
};

export default GrantList;
