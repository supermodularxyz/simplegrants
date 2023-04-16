/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import { useSession, signIn } from "next-auth/react";
import React from "react";
import MainLayout from "../../../layouts/MainLayout";
import Navbar from "../../../layouts/Navbar";
import Button from "../../../components/Button";
import axios from "../../../utils/axios";
import Link from "next/link";
import { toast } from "react-toastify";
import { GrantDetailResponse } from "../../../types/grant";
import Image from "next/image";
import { useRouter } from "next/router";
import Location from "../../../components/icons/Location";
import Twitter from "../../../components/icons/Twitter";
import Website from "../../../components/icons/Website";
import BackButton from "../../../components/BackButton";

export default function ReviewGrant() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();
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
    if (status === "unauthenticated") {
      router.replace("/sign-in");
      /**
       * There is no need to ensure you are an admin because this is already handled in the backend
       * Furthermore, it would be a slight security risk to store user roles in cookies
       */
    }
  }, [status]);

  const verifyGrant = () => {
    setLoading(true);
    axios
      .post(`/grants/verify/${id}`)
      .then(() => router.push(`/grants/${id}`))
      .catch((err) => {
        console.error({ err });
        toast.error(err.response.data.message || "Something went wrong", {
          toastId: "review-grant",
        });
      })
      .finally(() => setLoading(false));
  };

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
            <Link href="/grants/create">
              <Button>Create Grant</Button>
            </Link>
          </Navbar>
          <div className="flex flex-col items-start justify-center px-8 my-2 w-full">
            <BackButton href="/grants">Back to grants</BackButton>
            <div className="w-full flex flex-col md:flex-row my-10 gap-y-8">
              <div className="basis-full md:basis-3/5 px-4">
                <div className=" bg-white shadow-card py-8 px-6 rounded-xl ">
                  <div className="relative aspect-[3/2] lg:aspect-[3/1] h-full w-full rounded-lg overflow-hidden">
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
                        <Location className="fill-[#193154]" />
                        <p className="ml-2">{data.location}</p>
                      </div>
                    </div>
                    <div className="flex flex-row items-center gap-x-4">
                      <Link href={data.website}>
                        <Website className="fill-[#193154]" />
                      </Link>
                      <Link href={`https://twitter.com/${data.twitter}`}>
                        <Twitter className="fill-[#193154]" />
                      </Link>
                    </div>
                  </div>
                  <p className="mt-12">{data.description}</p>
                </div>
              </div>
              <div className="basis-full md:basis-2/5 px-4 flex flex-col items-center gap-4">
                <div className="flex flex-col w-full bg-white shadow-card py-8 px-6 rounded-xl">
                  <h2 className="font-bold text-xl mb-6">Payment Method</h2>
                  <p className="font-bold">
                    {data.paymentAccount.provider.name}
                  </p>
                  <p>ID: {data.paymentAccount.recipientAddress}</p>
                  <p>
                    Denomination:{" "}
                    {data.paymentAccount.provider.denominations.join(", ")}
                  </p>
                  <h2 className="font-bold text-xl my-4">Team</h2>
                  {data.team.map((team, index) => (
                    <p key={index}>
                      {team.name} - {team.email}
                    </p>
                  ))}
                  <Button
                    width="full"
                    className="mt-6"
                    disabled={data.verified || loading}
                    onClick={() => verifyGrant()}
                  >
                    Approve Grant
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </MainLayout>
      </div>
    )
  );
}
