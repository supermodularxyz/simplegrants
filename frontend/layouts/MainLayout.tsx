import Head from "next/head";
import { useSession, signIn, signOut } from "next-auth/react";
import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-react";
import React, { PropsWithChildren, ReactNode } from "react";

interface IMainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: IMainLayoutProps) {
  return (
    <main className="flex flex-col min-w-screen min-h-screen w-full h-full items-center justify-center">
      {children}
    </main>
  );
}
