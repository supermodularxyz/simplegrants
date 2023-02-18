/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import { useSession, signIn } from "next-auth/react";
import React from "react";
import MainLayout from "../../layouts/MainLayout";
import Navbar from "../../layouts/Navbar";
import Button from "../../components/Button";
import Link from "next/link";
import { GrantDetailResponse } from "../../types/grant";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCartStore } from "../../utils/store";
import Divider from "../../components/Divider";
import { useHasHydrated } from "../../utils/useHydrated";
import Input from "../../components/Input";
import { debounce as debouncer } from "lodash";
import axios from "../../utils/axios";
import { toast } from "react-toastify";

export default function GrantsCheckout() {
  const router = useRouter();
  const { grants, addToCart, removeFromCart, updateCart } = useCartStore();
  const { id } = router.query;
  const { data: session, status } = useSession();
  const [data, setData] = React.useState<any>();
  const [loading, setLoading] = React.useState(false);
  const hasHydrated = useHasHydrated();

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status]);

  React.useEffect(() => {
    if (data) {
      router.push(data.url);
    }
  }, [data]);

  const subtotal = React.useMemo(
    () => grants.reduce((acc, grant) => acc + grant.amount, 0),
    [grants]
  );

  const checkoutGrants = () => {
    setLoading(true);
    axios
      .post("/grants/checkout", {
        grants: grants.map((grant) => ({
          id: grant.id,
          amount: grant.amount,
        })),
      })
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error({ err });
        toast.error(err.message || "Something went wrong", {
          toastId: "checkout-grants-error",
        });
      })
      .finally(() => setLoading(false));
  };

  const updateGrantAmount = (id: string, amount: string) => {
    const num = parseFloat(amount);
    if (isNaN(num) || num < 0) {
      updateCart(id, 0);
    } else {
      updateCart(id, num);
    }
  };

  return (
    <div>
      <Head>
        <title>Checkout | SimpleGrantsCheckout</title>
        <meta
          name="description"
          content="Join us in making an impact through quadratic funding."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout>
        <Navbar className="p-0">
          {session ? (
            <Link href="/grants/create">
              <Button>Create Grant</Button>
            </Link>
          ) : (
            <Button onClick={() => signIn()}>Sign In</Button>
          )}
        </Navbar>
        <div className="flex flex-col items-start justify-center px-8 my-2 w-full">
          <h1 className="font-bold text-2xl my-14 px-4">Checkout Grants</h1>
          <div className="w-full flex flex-col md:flex-row gap-y-8">
            <div className="basis-full md:basis-3/5 px-4">
              <div className="flex flex-col bg-white shadow-card py-8 px-6 rounded-xl gap-y-6">
                {hasHydrated &&
                  grants.map((grant, index) => (
                    <React.Fragment key={grant.id}>
                      <div
                        className="flex flex-row w-full h-full items-center justify-between gap-x-6"
                        key={grant.id}
                      >
                        <div className="overflow-hidden rounded-lg flex-none">
                          <Image
                            src={grant.image}
                            width={132}
                            height={98}
                            className="aspect-[5/4]"
                            alt={grant.name}
                          />
                        </div>
                        <div className="flex flex-col h-full justify-between flex-auto gap-y-6">
                          <p className="font-bold text-lg h-full">
                            {grant.name}
                          </p>
                          <div className="flex flex-row items-center">
                            <Input
                              value={grant.amount
                                .toString()
                                .replace(/^0(?=\d)/, "")}
                              type="number"
                              placeholder="Amount"
                              onChange={(amount) =>
                                updateGrantAmount(grant.id, amount)
                              }
                              className="px-4 py-2 max-w-[144px] text-lg"
                            />
                            <p className="text-lg ml-3">USD</p>
                          </div>
                        </div>

                        <p
                          className="cursor-pointer h-full items-center justify-center"
                          onClick={() => removeFromCart(grant.id)}
                        >
                          Remove
                        </p>
                      </div>
                      {index !== grants.length - 1 && (
                        <Divider
                          orientation="horizontal"
                          className="bg-sg-500"
                          key={index}
                        />
                      )}
                    </React.Fragment>
                  ))}
              </div>
            </div>
            <div className="basis-full md:basis-2/5 px-4 flex flex-col items-center ">
              <div className="flex flex-col w-full bg-white shadow-card py-8 px-6 rounded-xl max-w-sm">
                <p className="font-bold text-xl mb-8">Summary</p>
                <p className="font-bold text-lg mb-3">Your Contributions</p>
                <div className="flex flex-col mb-6 gap-y-3">
                  {hasHydrated &&
                    grants.map((grant) => (
                      <div
                        className="flex flex-row w-full items-center justify-between"
                        key={grant.id}
                      >
                        <p className="flex flex-1 text-ellipsis truncate justify-start">
                          {grant.name}
                        </p>
                        <p className="flex flex-1 text-ellipsis truncate justify-end">
                          {grant.amount.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          USD
                        </p>
                      </div>
                    ))}
                </div>
                <Divider orientation="horizontal" className="bg-sg-700" />
                <div className="flex flex-row w-full items-center justify-between mt-6 mb-8">
                  <p className="flex flex-1 text-ellipsis truncate justify-start font-bold text-lg">
                    Total
                  </p>
                  <p className="flex flex-1 text-ellipsis truncate justify-end">
                    {hasHydrated &&
                      subtotal.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                    USD
                  </p>
                </div>
                <Button
                  onClick={checkoutGrants}
                  className="w-full"
                  disabled={(hasHydrated && subtotal <= 1) || loading}
                >
                  Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </div>
  );
}
