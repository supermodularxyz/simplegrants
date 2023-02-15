import Head from "next/head";
import { useSession, signIn, signOut } from "next-auth/react";
import React, { PropsWithChildren, ReactNode } from "react";
import Link from "next/link";
import { useCartStore } from "../utils/store";

interface INavbarProps {
  children: ReactNode;
}

export default function Navbar({ children }: INavbarProps) {
  const { data: session } = useSession();
  const { grants } = useCartStore();

  const subtotal = grants
    .reduce((acc, grant) => acc + grant.amount, 0)
    .toFixed(2);

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link className="btn btn-ghost normal-case text-xl" href="/">
          SimpleGrants
        </Link>
      </div>
      <div className="flex-none gap-x-7">
        {children}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <div className="indicator">
              <svg
                width="37"
                height="32"
                viewBox="0 0 37 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 0C6.6875 0 7.3125 0.5625 7.4375 1.25L7.5625 2H33.8125C35.125 2 36.125 3.3125 35.75 4.5625L32.375 16.5625C32.125 17.4375 31.375 18 30.4375 18H10.625L11.1875 21H30.5C31.3125 21 32 21.6875 32 22.5C32 23.375 31.3125 24 30.5 24H9.9375C9.25 24 8.625 23.5 8.5 22.8125L4.75 3H1.5C0.625 3 0 2.375 0 1.5C0 0.6875 0.625 0 1.5 0H6ZM8 29C8 27.375 9.3125 26 11 26C12.625 26 14 27.375 14 29C14 30.6875 12.625 32 11 32C9.3125 32 8 30.6875 8 29ZM32 29C32 30.6875 30.625 32 29 32C27.3125 32 26 30.6875 26 29C26 27.375 27.3125 26 29 26C30.625 26 32 27.375 32 29Z"
                  fill="#193154"
                />
              </svg>
              {/* <span className="badge badge-sm indicator-item">
                {grants.length}
              </span> */}
            </div>
          </label>
          <div
            tabIndex={0}
            className="mt-3 card card-compact dropdown-content w-52 bg-base-100 shadow"
          >
            <div className="card-body">
              <span className="font-bold text-lg">{grants.length} Items</span>
              <span className="text-info">Subtotal: ${subtotal}</span>
              <div className="card-actions">
                <button className="btn btn-primary btn-block">View cart</button>
              </div>
            </div>
          </div>
        </div>
        {session ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 0C7.125 0 0 7.1875 0 16C0 24.875 7.125 32 16 32C24.8125 32 32 24.875 32 16C32 7.1875 24.8125 0 16 0ZM16 8C18.4375 8 20.5 10.0625 20.5 12.5C20.5 15 18.4375 17 16 17C13.5 17 11.5 15 11.5 12.5C11.5 10.0625 13.5 8 16 8ZM16 28C12.6875 28 9.6875 26.6875 7.5 24.5C8.5 21.875 11 20 14 20H18C20.9375 20 23.4375 21.875 24.4375 24.5C22.25 26.6875 19.25 28 16 28Z"
                  fill="#193154"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a className="justify-between">Profile</a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a onClick={() => signOut()}>Logout</a>
              </li>
            </ul>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
