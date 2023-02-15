import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import Head from "next/head";
import React from "react";

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

      <main className="flex flex-col min-w-screen min-h-screen w-full h-full items-center justify-center">
        <div className="flex flex-col items-center justify-between h-full border border-black p-8">
          <h1 className="font-bold text-xl mb-16">Sign In / Sign Up</h1>
          <div className="flex flex-col items-center justify-center gap-y-5">
            {Object.values(providers).map((provider) => (
              <button
                key={provider.name}
                onClick={() => signIn(provider.id)}
                className="border border-black font-bold text-xl px-16 py-3 w-full"
              >
                Sign In With {provider.name}
              </button>
            ))}
          </div>
        </div>
      </main>
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
