/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import { useSession } from "next-auth/react";
import React from "react";
import MainLayout from "../../../layouts/MainLayout";
import Navbar from "../../../layouts/Navbar";
import Button from "../../../components/Button";
import { useRouter } from "next/router";
import GrantCard from "../../../components/GrantCard";
import { useGrantStore } from "../../../utils/store";

export default function CreateGrantSuccess() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { grant } = useGrantStore();

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/sign-in");
    }
  }, [status]);

  React.useEffect(() => {
    if (!grant) {
      router.push("/grants");
    }
  });

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

      <MainLayout>
        <Navbar className="p-0" />
        {grant && (
          <div className="flex flex-col items-center justify-center px-8 my-2 w-full">
            <h1 className="font-bold text-3xl">Congratulations!</h1>
            <p className="text-2xl">Your grant has been created.</p>
            <GrantCard grant={grant} className="my-8" hideButton hideProgress />
            <Button
              style="ghost"
              onClick={() => {
                navigator.clipboard.writeText("https://simplegrants.xyz/");
              }}
            >
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
