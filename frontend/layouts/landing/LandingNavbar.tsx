import { signIn } from "next-auth/react";
import React from "react";
import Link from "next/link";
import clsx from "clsx";
import Image from "next/image";
import Button from "../../components/Button";

interface ILandingNavbarProps {
  className?: string;
}

export default function LandingNavbar({ className }: ILandingNavbarProps) {
  return (
    <div className={clsx("navbar", className)}>
      <div className="navbar-start w-max">
        <div className="w-max">
          <Link className="btn btn-ghost" href="/">
            <Image
              src="/logo.svg"
              alt="SimpleGrants"
              width={103.55}
              height={32}
            />
          </Link>
        </div>
      </div>
      <div className="navbar-end flex-grow">
        <div className="flex-none gap-x-7 hidden lg:flex">
          <Button style="ghost" onClick={() => signIn()}>
            Sign In
          </Button>
          <Button className="bg-white border-none" onClick={() => signIn()}>
            Sign Up
          </Button>
        </div>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link href="/sign-in">Sign In</Link>
            </li>
            <li>
              <Link href="/sign-in">Sign Up</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
