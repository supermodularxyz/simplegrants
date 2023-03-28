/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import { useSession } from "next-auth/react";
import React from "react";
import MainLayout from "../../../layouts/MainLayout";
import Button from "../../../components/Button";
import { useRouter } from "next/router";
import GrantCard from "../../../components/GrantCard";
import { useGrantStore } from "../../../utils/store";
import Copy from "../../../components/icons/Copy";
import { GrantDetailResponse } from "../../../types/grant";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

export default function CreateGrantSuccess() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { grant } = useGrantStore();
  const [createdGrant, setCreatedGrant] = React.useState<GrantDetailResponse>();

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/sign-in");
    }
  }, [status]);

  React.useEffect(() => {
    if (!grant) {
      router.push("/grants");
    }
    setCreatedGrant(grant);
  }, []);

  return (
    <div>
      <Head>
        <title>Grant Created | SimpleGrants</title>
        <meta
          name="description"
          content="Join us in making an impact through quadratic funding."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout className="h-full min-h-screen items-center justify-center bg-sg-gradient">
        <Image
          src={"/assets/texture.svg"}
          alt=""
          fill
          className="object-cover"
        />
        <div className="flex flex-row items-center justify-between w-full fixed top-0 px-2 py-4 lg:px-8 lg:py-6">
          <Link className="btn btn-ghost" href="/">
            <Image
              src="/logo.svg"
              alt="SimpleGrants"
              width={103.55}
              height={32}
            />
          </Link>
          <Link className="flex flex-row items-center" href="/grants">
            <ArrowLeftIcon className="mr-2" />
            <p className="font-bold">Back to Home</p>
          </Link>
        </div>
        {createdGrant && (
          <div className="flex flex-col items-center justify-center px-8 my-2 w-full z-10">
            <h1 className="font-bold text-2xl lg:text-3xl text-center">
              Congratulations!
            </h1>
            <p className="text-xl lg:text-2xl text-center">
              Your grant has been created.
            </p>
            <GrantCard
              grant={createdGrant}
              onClick={() => router.push(`/grants/${createdGrant.id}`)}
              className="my-8"
              hideButton
              hideProgress
            />
            <Button
              style="ghost"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${
                    process.env.NODE_ENV === "production"
                      ? "https://simplegrants.xyz"
                      : "http://localhost:3001"
                  }/grants/${createdGrant.id}`
                );
              }}
              className="mb-5"
            >
              <Copy className="stroke-sg-secondary mr-2" />
              Copy link
            </Button>
            <div className="flex flex-row items-center justify-center w-full gap-6">
              <Button style="outline">Share on Twitter</Button>
              <Button style="outline">Share on Facebook</Button>
            </div>
          </div>
        )}
      </MainLayout>
    </div>
  );
}
