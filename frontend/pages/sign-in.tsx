import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import Head from "next/head";
import React from "react";
import MainLayout from "../layouts/MainLayout";
import Button from "../components/Button";

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      <Head>
        <title>SimpleGrants</title>
        <meta
          name="description"
          content="Join us in making an impact through quadratic funding."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout className="items-center justify-center">
        <div className="flex flex-col items-center justify-between h-full rounded-lg bg-white p-8 shadow-card">
          <h1 className="font-bold text-xl mb-16">Sign In / Sign Up</h1>
          <div className="flex flex-col items-center justify-center gap-y-5">
            {Object.values(providers).map((provider) => (
              <Button
                key={provider.name}
                onClick={() => signIn(provider.id)}
                className="px-16 py-3 text-xl"
              >
                Sign In With {provider.name}
              </Button>
            ))}
          </div>
        </div>
      </MainLayout>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/grants" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
