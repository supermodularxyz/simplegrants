import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import Head from "next/head";
import React from "react";
import MainLayout from "../../layouts/MainLayout";
import { useRouter } from "next/router";

export default function GetStarted() {
  const router = useRouter();

  return (
    <div>
      <Head>
        <title>Ecosystem Builder | SimpleGrants</title>
        <meta
          name="description"
          content="Join us in making an impact through quadratic funding."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout className="items-center justify-center">
        <div className="flex flex-col items-center justify-between h-full text-center">
          <h1 className="font-bold text-4xl mb-5">Hi there</h1>
        </div>
      </MainLayout>
    </div>
  );
}
