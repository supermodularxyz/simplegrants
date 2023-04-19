import Head from "next/head";
import React from "react";
import MainLayout from "../layouts/MainLayout";
import Button from "../components/Button";
import { useRouter } from "next/router";

export default function GetStarted() {
  const router = useRouter();

  return (
    <div>
      <Head>
        <title>Get Started | SimpleGrants</title>
        <meta
          name="description"
          content="Join us in making an impact through quadratic funding."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout className="items-center justify-center">
        <div className="flex flex-col items-center justify-between h-full text-center">
          <h1 className="font-bold text-4xl mb-5">Let&apos;s get started</h1>
          <p className="mb-14">What would you like to do first?</p>
          <div className="flex flex-row flex-wrap items-center justify-center gap-x-9 gap-y-4">
            <Button
              style="outline"
              className="min-w-[180px] text-base"
              onClick={() => router.push("/grants/create")}
            >
              Create a Grant
            </Button>
            <Button
              style="outline"
              className="min-w-[180px] text-base"
              onClick={() => router.push("/grants/")}
            >
              Donate to Grants
            </Button>
            <Button
              style="outline"
              className="min-w-[180px] text-base"
              onClick={() => router.push("/pools/")}
            >
              Contribute
            </Button>
          </div>
        </div>
      </MainLayout>
    </div>
  );
}
