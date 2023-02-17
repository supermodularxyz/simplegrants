import Head from "next/head";
import { useSession, signIn, signOut } from "next-auth/react";
import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-react";
import React from "react";

export default function Home() {
  const { data: session } = useSession();
  const { getData } = useVisitorData({ tag: "signin" }, { immediate: false });

  React.useEffect(() => {
    const saveFingerprintData = async () => {
      getData().then((res) => {
        fetch("/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            user: res.visitorId,
          }),
        });
      });
    };

    if (session) {
      saveFingerprintData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

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
        {session ? (
          <>
            Signed in as {session?.user?.email} <br />
            <button onClick={() => signOut()}>Sign out</button>
          </>
        ) : (
          <>
            Not signed in <br />
            <button onClick={() => signIn()}>Sign in</button>
          </>
        )}
      </main>
    </div>
  );
}
