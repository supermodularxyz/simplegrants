import React from "react";
import Image from "next/image";
import { GrantDetailResponse } from "../../types/grant";
import Link from "next/link";
import Website from "../icons/Website";
import Location from "../icons/Location";
import Twitter from "../icons/Twitter";
import clsx from "clsx";
import Close from "../icons/Close";

interface IGrantModalProps {
  grant: GrantDetailResponse;
  onClose: () => void;
  className?: string;
}

const GrantModal = ({ grant, className, onClose }: IGrantModalProps) => {
  return (
    grant && (
      <div
        className={clsx(
          className,
          "flex flex-col w-full h-full px-2 py-4 lg:px-8 lg:py-6"
        )}
      >
        <div className="flex flex-col items-start justify-center my-2 w-full">
          <p onClick={onClose} className="cursor-pointer">
            <Close className="fill-sg-secondary" />
          </p>
          <div className="w-full flex flex-col md:flex-row my-10 gap-y-8">
            <div className="basis-full md:basis-3/5 px-4">
              <div className=" bg-white shadow-card py-8 px-6 rounded-xl ">
                <div className="relative aspect-[3/2] lg:aspect-[3/1] h-full w-full rounded-lg overflow-hidden">
                  <Image
                    alt={grant.name}
                    src={grant.image}
                    fill
                    className="aspect-[3/2] lg:aspect-[3/1] object-cover"
                  />
                </div>
                <div className="flex flex-row items-center justify-between">
                  <div className="flex flex-col">
                    <p className="font-bold text-2xl mb-3 mt-6">{grant.name}</p>
                    <div className="flex flex-row items-center">
                      <Location className="fill-[#193154]" />
                      <p className="ml-2">{grant.location}</p>
                    </div>
                  </div>
                  <div className="flex flex-row items-center gap-x-4">
                    <Link href={grant.website}>
                      <Website className="fill-[#193154]" />
                    </Link>
                    <Link href={`https://twitter.com/${grant.twitter}`}>
                      <Twitter className="fill-[#193154]" />
                    </Link>
                  </div>
                </div>
                <p className="mt-12">{grant.description}</p>
              </div>
            </div>
            <div className="basis-full md:basis-2/5 px-4 flex flex-col items-center gap-4">
              <div className="flex flex-col w-full bg-white shadow-card py-8 px-6 rounded-xl">
                <h2 className="font-bold text-xl mb-6">Payment Method</h2>
                <p className="font-bold">
                  {grant.paymentAccount.provider.name}
                </p>
                <p>ID: {grant.paymentAccount.recipientAddress}</p>
                <p>
                  Denomination:{" "}
                  {grant.paymentAccount.provider.denominations.join(", ")}
                </p>
                <h2 className="font-bold text-xl my-4">Team</h2>
                {grant.team.map((team, index) => (
                  <p key={index}>
                    {team.name} - {team.email}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default GrantModal;
