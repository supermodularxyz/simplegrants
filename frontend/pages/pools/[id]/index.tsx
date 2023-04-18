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
import { PoolDetailResponse } from "../../../types/pool";
import { useRouter } from "next/router";
import { usePoolCartStore } from "../../../utils/store";
import BackButton from "../../../components/BackButton";
import clsx from "clsx";
import GrantCard from "../../../components/grant/GrantCard";
import dayjs from "dayjs";
import { Dialog } from "@headlessui/react";
import { GrantDetailResponse } from "../../../types/grant";
import GrantModal from "../../../components/grant/GrantModal";

export default function PoolDetails() {
  const router = useRouter();
  const { pools, addToCart, removeFromCart } = usePoolCartStore();
  const { id } = router.query;
  const { data: session, status } = useSession();
  const [data, setData] = React.useState<PoolDetailResponse>();
  const [grant, setGrant] = React.useState<GrantDetailResponse>();
  const [loading, setLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const hasEnded = React.useMemo(
    () => (data ? dayjs(data.endDate).diff(dayjs()) <= 0 : true),
    [data]
  );

  const getPool = () => {
    setLoading(true);
    axios
      .get(`/pools/${id}`)
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error({ err });
        toast.error(err.message || "Something went wrong", {
          toastId: "retrieve-pool-error",
        });
      })
      .finally(() => setLoading(false));
  };

  const getGrant = (grantId: string) => {
    setLoading(true);
    axios
      .get(`/grants/${grantId}`)
      .then((res) => {
        setGrant(res.data);
        setIsOpen(true);
      })
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
      getPool();
    }
  }, [id]);

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/sign-in");
    }
  }, [status]);

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
          <Navbar className="p-0" location="pools">
            <Link href="/pools/create">
              <Button>Create Pool</Button>
            </Link>
          </Navbar>
          <div className="flex flex-col items-start justify-center px-4 md:px-8 my-2 w-full">
            <BackButton href="/pools">Back to pools</BackButton>
            <div className="w-full flex flex-col md:flex-row my-10 gap-y-8">
              <div className="basis-full md:basis-3/5 md:px-4">
                <div className=" bg-white shadow-card py-8 px-6 rounded-xl ">
                  <p className="font-bold text-2xl my-6">{data.name}</p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-11 gap-y-8 justify-items-center">
                    {data.grants.map((grant) => (
                      <GrantCard
                        grant={grant}
                        key={grant.id}
                        hideButton
                        onClick={() => getGrant(grant.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="basis-full md:basis-2/5 px-4 flex flex-col items-center gap-4">
                <div className="grid grid-cols-2 w-full bg-white shadow-card py-8 px-6 rounded-xl max-w-sm gap-y-6 gap-x-10">
                  <div className="flex flex-col col-span-1">
                    <p className="">
                      <b className="text-2xl">
                        $
                        {data.amountRaised.toLocaleString("en-US", {
                          maximumFractionDigits: 0,
                        })}
                      </b>
                      <br />
                      raised
                    </p>
                  </div>
                  <div className="flex flex-col col-span-1">
                    <p className="">
                      <b className="text-2xl">{data.contributors}</b>
                      <br />
                      contributors
                    </p>
                  </div>
                  <div className="flex flex-col col-span-1">
                    <p className="">
                      <b className="text-2xl">
                        {dayjs(data.endDate).diff(dayjs(), "days")}
                      </b>
                      <br />
                      days to go
                    </p>
                  </div>
                  <div className="flex flex-col col-span-1">
                    <p className="">
                      <b className="text-2xl">{data.grants.length}</b>
                      <br />
                      grants in pool
                    </p>
                  </div>
                  {!data.verified && (
                    <div className="badge badge-error col-span-2 lg:col-span-1">
                      Unverified Pool
                    </div>
                  )}
                  {pools.find((pool) => pool.id === id) ? (
                    <Button
                      width="full"
                      className="btn-error col-span-2"
                      onClick={() => removeFromCart(id as string)}
                    >
                      Remove from cart
                    </Button>
                  ) : (
                    <div
                      className={clsx(
                        data.verified && !hasEnded
                          ? ""
                          : "tooltip tooltip-secondary",
                        "col-span-2"
                      )}
                      data-tip={
                        hasEnded
                          ? "Pool has ended"
                          : "This pool is unverified, therefore you cannot donate to it."
                      }
                    >
                      <Button
                        width="full"
                        className=""
                        disabled={!data.verified || hasEnded}
                        onClick={() => addToCart(data)}
                      >
                        Add to cart
                      </Button>
                    </div>
                  )}
                </div>
                {!hasEnded &&
                  data.team.some(
                    (team) => team.id === (session?.user as any).id
                  ) && (
                    <div className="flex flex-col w-full bg-white shadow-card py-8 px-6 rounded-xl max-w-sm">
                      <p className="font-bold mb-4">Looking to make changes?</p>
                      <Link href={`/pools/${id}/edit`}>
                        <Button width="full" className="">
                          Edit Pool
                        </Button>
                      </Link>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </MainLayout>
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative z-50"
        >
          {/* The backdrop, rendered as a fixed sibling to the panel container */}
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          {/* Full-screen container to center the panel */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            {/* The actual dialog panel  */}
            <Dialog.Panel className="max-w-7xl rounded bg-white h-max">
              {grant && (
                <GrantModal grant={grant} onClose={() => setIsOpen(false)} />
              )}
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    )
  );
}
