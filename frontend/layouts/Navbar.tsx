import { useSession, signOut } from "next-auth/react";
import React, { ReactNode } from "react";
import Link from "next/link";
import { useCartStore } from "../utils/store";
import clsx from "clsx";
import Cart from "../components/icons/Cart";
import Avatar from "../components/icons/Avatar";
import Image from "next/image";
import { useHasHydrated } from "../utils/useHydrated";

interface INavbarProps {
  children: ReactNode;
  className?: string;
}

export default function Navbar({ children, className }: INavbarProps) {
  const { data: session } = useSession();
  const { grants } = useCartStore();
  const hasHydrated = useHasHydrated();

  const subtotal = React.useMemo(
    () => grants.reduce((acc, grant) => acc + grant.amount, 0).toFixed(2),
    [grants]
  );

  return (
    <div className={clsx("navbar", className)}>
      <div className="flex-1">
        <Link className="btn btn-ghost normal-case text-xl" href="/">
          <Image
            src="/logo.svg"
            alt="SimpleGrants"
            width={103.55}
            height={32}
          />
        </Link>
      </div>
      <div className="flex-none gap-x-7">
        {children}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <div className="indicator">
              <Cart className="fill-[#193154]" />
            </div>
          </label>
          <div
            tabIndex={0}
            className="mt-3 card card-compact dropdown-content w-52 bg-base-100 shadow"
          >
            <div className="card-body">
              <span className="font-bold text-lg">
                {hasHydrated && grants.length} Items
              </span>
              <span className="text-info">Subtotal: ${subtotal}</span>
              <div className="card-actions">
                <Link href="/grants/checkout" className="w-full h-full">
                  <button className="btn btn-primary btn-block">
                    View cart
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        {session ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <Avatar className="fill-[#193154]" />
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
