import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { FpjsProvider } from "@fingerprintjs/fingerprintjs-pro-react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <FpjsProvider
      loadOptions={{
        apiKey: process.env.NEXT_PUBLIC_FINGERPRINT_KEY || "",
      }}
    >
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </FpjsProvider>
  );
}
