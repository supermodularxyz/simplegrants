import React from "react";
import Image from "next/image";
import {
  GrantResponse,
  GrantResponseWithContributions,
  PoolGrantResponse,
} from "../../types/grant";
import FundingBar from "../FundingBar";
import { useGrantCartStore } from "../../utils/store";
import Button from "../Button";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Card from "../../layouts/Card";

interface IGrantCardProps {
  grant: GrantResponse | GrantResponseWithContributions | PoolGrantResponse;
  onClick?: (e?: any) => any;
  children?: React.ReactNode;
  hideButton?: boolean;
  hideProgress?: boolean;
  className?: string;
}

const GrantCard = ({
  grant,
  children,
  onClick,
  hideButton = false,
  hideProgress = false,
  className,
}: IGrantCardProps) => {
  const { grants, addToCart, removeFromCart } = useGrantCartStore();
  const { data: session } = useSession();

  const addedToCart = React.useMemo(
    () => grants.find((data) => data.id === grant.id),
    [grants, grant]
  );

  return (
    <Card
      className={clsx("bg-white shadow-card cursor-pointer", className)}
      onClick={onClick}
    >
      <div className="relative w-full aspect-[5/3] h-full max-h-[210px]">
        <Image
          alt={grant.name}
          src={grant.image}
          fill
          className="aspect-[5/3] object-contain"
        />
      </div>
      <div className="flex flex-col px-8 py-6 h-full items-start justify-between">
        <div className="flex flex-col">
          <p className="font-bold text-[22px]">{grant.name}</p>
          {"team" in grant && (
            <p className="text-sg-700">by {grant.team[0].name}</p>
          )}
          <p className="text-sm mt-4 overflow-hidden text-ellipsis line-clamp-3">
            {grant.description}
          </p>
        </div>
        <div
          className={clsx(
            "flex flex-col w-full",
            hideButton && hideProgress ? "" : "mt-8"
          )}
        >
          {!hideProgress && (
            <>
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
            </>
          )}

          {!hideButton && (
            <>
              {addedToCart ? (
                <Button
                  width="full"
                  className="btn-error"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromCart(grant.id);
                  }}
                >
                  Remove from cart
                </Button>
              ) : (
                <Button
                  width="full"
                  className=""
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(grant);
                  }}
                  disabled={
                    "team" in grant
                      ? grant.team.some(
                          (team) => team.email === session?.user?.email
                        )
                      : false
                  }
                >
                  Add to cart
                </Button>
              )}
            </>
          )}
        </div>
        {children}
      </div>
    </Card>
  );
};

export default GrantCard;
