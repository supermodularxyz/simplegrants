import React from "react";
import Image from "next/image";
import { PoolResponse } from "../../types/pool";
import { usePoolCartStore } from "../../utils/store";
import Button from "../Button";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
dayjs.extend(advancedFormat);

interface IPoolListProps {
  pool: PoolResponse;
  onClick?: (e?: any) => any;
}

const PoolList = ({ pool, onClick }: IPoolListProps) => {
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
      className="flex flex-col md:flex-row w-full bg-white shadow-card py-8 px-6 rounded-lg gap-x-6 cursor-pointer"
      key={pool.id}
      onClick={onClick}
    >
      <div className="overflow-hidden rounded-lg aspect-[5/3] h-full max-w-xs w-full relative flex-none mb-4 md:mb-0">
        <Image
          src="/assets/pool-placeholder-image.png"
          fill
          className="aspect-[5/3] object-cover"
          alt={pool.name}
        />
      </div>
      <div className="flex flex-col flex-grow w-full justify-between mb-4 md:mb-0">
        <div className="flex flex-col mb-4">
          <p className="font-bold text-xl">{pool.name}</p>
          <p className="text-sm mt-4 overflow-hidden text-ellipsis line-clamp-3">
            {pool.description}
          </p>
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
      </div>
      {addedToCart ? (
        <Button
          className="flex-none btn-error"
          onClick={(e) => {
            e.stopPropagation();
            removeFromCart(pool.id);
          }}
        >
          Remove from cart
        </Button>
      ) : (
        <Button
          className="flex-none md:w-max w-full"
          width="custom"
          onClick={(e) => {
            e.stopPropagation();
            addToCart(pool);
          }}
          disabled={dayjs(pool.endDate).diff(dayjs()) <= 0}
        >
          Add to cart
        </Button>
      )}
    </div>
  );
};

export default PoolList;
