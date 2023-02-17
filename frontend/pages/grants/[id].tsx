/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import { useSession, signIn } from "next-auth/react";
import React from "react";
import MainLayout from "../../layouts/MainLayout";
import Navbar from "../../layouts/Navbar";
import Button from "../../components/Button";
import axios from "../../utils/axios";
import Link from "next/link";
import { toast } from "react-toastify";
import { GrantDetailResponse } from "../../types/grant";
import Image from "next/image";
import { useRouter } from "next/router";
import FundingBar from "../../components/Progress";
import { useCartStore } from "../../utils/store";

export default function Grants() {
  const router = useRouter();
  const { grants, addToCart, removeFromCart } = useCartStore();
  const { id } = router.query;
  const { data: session } = useSession();
  const [data, setData] = React.useState<GrantDetailResponse>();
  const [loading, setLoading] = React.useState(false);

  const getGrant = () => {
    setLoading(true);
    axios
      .get(`/grants/${id}`)
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error({ err });
        toast.error(err.message || "Something went wrong", {
          toastId: "retrieve-grant-error",
        });
      })
      .finally(() => setLoading(false));
  };

  React.useEffect(() => {
    if (id) {
      getGrant();
    }
  }, [id]);

  React.useEffect(() => {
    if (session && !session?.user) {
      router.push("/sign-in");
    }
  }, [session]);

  return (
    data && (
      <div>
        <Head>
          <title>{data.name} | SimpleGrants</title>
          <meta
            name="description"
            content="Join us in making an impact through quadratic funding."
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <MainLayout>
          <Navbar className="p-0">
            {session ? (
              <Button>
                <Link href="/grants/create">Create Grant</Link>
              </Button>
            ) : (
              <Button onClick={() => signIn()}>Sign In</Button>
            )}
          </Navbar>
          <div className="flex flex-col items-start justify-center px-8 my-2 w-full">
            <Link href="/grants">&lt; Back to grants</Link>
            <div className="w-full flex flex-col md:flex-row my-10 gap-y-8">
              <div className="basis-full md:basis-3/5 px-4">
                <div className=" bg-white shadow-card py-8 px-6 rounded-xl ">
                  <div className="relative aspect-[3/2] lg:aspect-[3/1] h-full w-full">
                    <Image
                      alt={data.name}
                      src={data.image}
                      fill
                      className="aspect-[3/2] lg:aspect-[3/1] object-cover"
                    />
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-col">
                      <p className="font-bold text-2xl mb-3 mt-6">
                        {data.name}
                      </p>
                      <div className="flex flex-row items-center">
                        <svg
                          width="16"
                          height="21"
                          viewBox="0 0 16 21"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7.0625 19.5312C5.03125 16.9922 0.5 10.9375 0.5 7.5C0.5 3.35938 3.82031 0 8 0C12.1406 0 15.5 3.35938 15.5 7.5C15.5 10.9375 10.9297 16.9922 8.89844 19.5312C8.42969 20.1172 7.53125 20.1172 7.0625 19.5312ZM8 10C9.36719 10 10.5 8.90625 10.5 7.5C10.5 6.13281 9.36719 5 8 5C6.59375 5 5.5 6.13281 5.5 7.5C5.5 8.90625 6.59375 10 8 10Z"
                            fill="#193154"
                          />
                        </svg>
                        <p className="ml-2">{data.location}</p>
                      </div>
                    </div>
                    <div className="flex flex-row items-center gap-x-4">
                      <Link href={data.website}>
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M22 16C22 17.4375 21.875 18.75 21.75 20H10.1875C10.0625 18.75 9.9375 17.4375 9.9375 16C9.9375 14.625 10.0625 13.3125 10.1875 12H21.75C21.875 13.3125 22 14.625 22 16ZM31.4375 12C31.8125 13.3125 32 14.625 32 16C32 17.4375 31.8125 18.75 31.4375 20H23.75C23.875 18.75 24 17.375 24 16C24 14.625 23.875 13.3125 23.75 12H31.4375ZM30.8125 10H23.5C22.875 6.0625 21.625 2.6875 20.0625 0.5625C24.9375 1.875 28.9375 5.375 30.8125 10ZM21.5 10H10.4375C10.8125 7.75 11.4375 5.75 12.125 4.125C12.8125 2.625 13.5 1.5625 14.25 0.875C14.9375 0.25 15.5 0 16 0C16.4375 0 17 0.25 17.6875 0.875C18.4375 1.5625 19.125 2.625 19.8125 4.125C20.5 5.75 21.125 7.75 21.5 10ZM1.125 10C3 5.375 7 1.875 11.875 0.5625C10.3125 2.6875 9.0625 6.0625 8.4375 10H1.125ZM8.1875 12C8.0625 13.3125 7.9375 14.625 7.9375 16C7.9375 17.375 8.0625 18.75 8.1875 20H0.5C0.125 18.75 0 17.4375 0 16C0 14.625 0.125 13.3125 0.5 12H8.1875ZM12.125 27.9375C11.4375 26.3125 10.8125 24.3125 10.4375 22H21.5C21.125 24.3125 20.5 26.3125 19.8125 27.9375C19.125 29.4375 18.4375 30.5 17.6875 31.1875C17 31.8125 16.4375 32 15.9375 32C15.5 32 14.9375 31.8125 14.25 31.1875C13.5 30.5 12.8125 29.4375 12.125 27.9375ZM11.875 31.5C7 30.1875 3 26.6875 1.125 22H8.4375C9.0625 26 10.3125 29.375 11.875 31.5ZM20.0625 31.5C21.625 29.375 22.875 26 23.5 22H30.8125C28.9375 26.6875 24.9375 30.1875 20.0625 31.5Z"
                            fill="#193154"
                          />
                        </svg>
                      </Link>
                      <Link href={`https://twitter.com/${data.twitter}`}>
                        <svg
                          width="38"
                          height="38"
                          viewBox="0 0 38 38"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M35.4667 8.78689C34.2545 9.32522 32.9523 9.68749 31.5856 9.85089C32.9815 9.01489 34.0518 7.69122 34.5559 6.11296C33.2513 6.88689 31.8047 7.44929 30.2645 7.75329C29.032 6.43976 27.2764 5.61896 25.3333 5.61896C21.6017 5.61896 18.5769 8.64503 18.5769 12.3754C18.5769 12.9048 18.6377 13.4216 18.7517 13.9144C13.1366 13.6332 8.15861 10.9428 4.82474 6.85396C4.24461 7.85209 3.91147 9.01236 3.91147 10.2524C3.91147 12.5958 5.10341 14.6642 6.91601 15.8752C5.80894 15.8397 4.76647 15.5357 3.85574 15.0303C3.85574 15.0594 3.85574 15.086 3.85574 15.1152C3.85574 18.3895 6.18387 21.1204 9.27581 21.7398C8.70961 21.8944 8.11174 21.9767 7.49487 21.9767C7.06041 21.9767 6.63607 21.9336 6.22441 21.8564C7.08447 24.5404 9.57981 26.4949 12.5362 26.5494C10.2245 28.362 7.31121 29.4424 4.14454 29.4424C3.59987 29.4424 3.06154 29.4108 2.53207 29.3474C5.52267 31.2639 9.07314 32.3824 12.8896 32.3824C25.3181 32.3824 32.1125 22.0869 32.1125 13.1582C32.1125 12.8656 32.1062 12.5742 32.0935 12.2842C33.4147 11.3304 34.561 10.141 35.4667 8.78689Z"
                            fill="#193154"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                  <p className="mt-12">{data.description}</p>
                </div>
              </div>
              <div className="basis-full md:basis-2/5 px-4 flex flex-col items-center ">
                <div className="flex flex-col w-full bg-white shadow-card py-8 px-6 rounded-xl max-w-sm">
                  <FundingBar
                    className="mb-4"
                    value={data.amountRaised}
                    max={data.fundingGoal}
                  />
                  <p className="font-bold text-2xl">
                    ${" "}
                    {data.amountRaised.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="mb-2">
                    raised of ${" "}
                    {data.fundingGoal.toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}{" "}
                    goal
                  </p>

                  <p className="font-bold text-2xl">
                    {data.contributions.length.toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="mb-4">contributors</p>
                  {grants.find((grant) => grant.id === id) ? (
                    <Button
                      className="w-full btn-error"
                      onClick={() => removeFromCart(id as string)}
                    >
                      Remove from cart
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() =>
                        addToCart({
                          id: id as string,
                          amount: 0,
                        })
                      }
                    >
                      Add to cart
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </MainLayout>
      </div>
    )
  );
}
