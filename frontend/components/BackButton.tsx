import React, { ReactNode } from "react";
import Link from "next/link";

interface IBackButtonProps {
  children: ReactNode;
  href: string;
}

export default function BackButton({ href, children }: IBackButtonProps) {
  return (
    <Link href={href} className="mt-4">
      &lt; {children}
    </Link>
  );
}
