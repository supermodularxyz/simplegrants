import React from "react";
import Image from "next/image";
import { BasicGrantResponse } from "../types/grant";
import { UserProfileContributionInfo } from "../types/contributions";

interface IDonationListProps {
  grant: BasicGrantResponse;
  contribution: UserProfileContributionInfo;
  onClick?: (e?: any) => any;
}

const DonationList = ({ grant, onClick, contribution }: IDonationListProps) => {
  return (
    <div
      className="flex flex-col lg:flex-row w-full bg-white shadow-card py-8 px-6 rounded-lg gap-4 md:gap-10 cursor-pointer"
      key={grant.id}
      onClick={onClick}
    >
      <div className="flex flex-row gap-x-4 md:gap-x-10 basis-full md:basis-2/3">
        <div className="overflow-hidden rounded-lg aspect-[3/2] md:aspect-[5/3] h-max max-w-[128px] w-full relative flex-none mb-4 md:mb-0">
          <Image
            src={grant.image}
            fill
            className="aspect-[3/2] md:aspect-[5/3]"
            alt={grant.name}
          />
        </div>
        <div className="flex flex-col mb-4 md:mb-0 max-w-3xl basis-1/2 md:basis-3/4">
          <p className="font-bold text-base md:text-xl">{grant.name}</p>
          <p className="leading-relaxed text-sm line-clamp-3">
            {grant.description}
          </p>
        </div>
      </div>
      <div className="flex flex-row gap-x-4 md:gap-x-10 basis-full md:basis-1/3">
        <div className="flex flex-col whitespace-nowrap basis-1/2">
          <p className="text-base md:text-xl font-bold">Donated</p>
          <p>
            ${" "}
            {contribution.amountUsd.toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })}{" "}
            USD
          </p>
        </div>
        <div className="flex flex-col whitespace-nowrap basis-1/2">
          <p className="text-base md:text-xl font-bold">Matched</p>
          <p className="font-bold text-sg-success">
            ${" "}
            {(
              (contribution.amountUsd / contribution.totalDonated) *
              contribution.totalMatched
            ).toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })}{" "}
            USD
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonationList;
