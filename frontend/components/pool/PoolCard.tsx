import React from "react";
import Image from "next/image";
import { PoolResponse } from "../../types/pool";
import { usePoolCartStore } from "../../utils/store";
import Button from "../Button";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
dayjs.extend(advancedFormat);

interface IPoolCardProps {
  pool: PoolResponse;
  onClick?: (e?: any) => any;
  hideButton?: boolean;
  className?: string;
}

const PoolCard = ({
  pool,
  onClick,
  hideButton = false,
  className,
}: IPoolCardProps) => {
  const { pools, addToCart, removeFromCart } = usePoolCartStore();
  const { data: session } = useSession();

  const addedToCart = React.useMemo(
    () => pools.find((data) => data.id === pool.id),
    [pools, pool]
  );

  const timeRemaining = React.useMemo(() => {
    const now = dayjs();
    const endDate = dayjs(pool.endDate);
    const units: ("days" | "hours" | "minutes" | "seconds")[] = [
      "days",
      "hours",
      "minutes",
      "seconds",
    ];

    let unit;
    let diff = 0;
    while (diff === 0) {
      unit = units.shift();
      diff = endDate.diff(now, unit);
    }
    if (diff < 0) return <b>Ended</b>;
    return (
      <>
        Ends in{" "}
        <b>
          {diff} {diff > 1 ? unit : unit?.slice(0, -1)}
        </b>
      </>
    );
  }, [pool]);

  return (
    <div
      className={clsx(
        "flex flex-col w-full min-w-[240px] lg:min-w-[350px] max-w-[350px] bg-white rounded-lg overflow-hidden cursor-pointer shadow-card",
        className
      )}
      key={pool.id}
      onClick={onClick}
    >
      <div className="relative w-full aspect-[5/3] h-full max-h-[210px]">
        <Image
          alt={pool.name}
          src="/assets/pool-placeholder-image.png"
          fill
          className="aspect-[5/3] object-cover"
        />
      </div>
      <div className="flex flex-col px-8 py-6 h-full items-start justify-between">
        <div className="flex flex-col">
          <p className="font-bold text-[22px]">{pool.name}</p>
          <p className="my-2">
            <b className="font-bold text-xl">
              ~USD${" "}
              {pool.amountRaised.toLocaleString("en-US", {
                maximumFractionDigits: 0,
              })}
            </b>{" "}
            raised
          </p>
          <p>
            {timeRemaining} <br /> on{" "}
            {dayjs(pool.endDate).format("Do MMM YYYY")}
          </p>
        </div>
        <div className={clsx("flex flex-col w-full", hideButton ? "" : "mt-4")}>
          {!hideButton && (
            <>
              {addedToCart ? (
                <Button
                  width="full"
                  className="btn-error"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromCart(pool.id);
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
                    addToCart(pool);
                  }}
                  disabled={dayjs(pool.endDate).diff(dayjs()) <= 0}
                >
                  Add to cart
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PoolCard;
