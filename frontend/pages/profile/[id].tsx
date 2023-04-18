import Head from "next/head";
import { useSession } from "next-auth/react";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import { UserProfile } from "../../types/user";
import * as Tabs from "@radix-ui/react-tabs";
import GrantCard from "../../components/grant/GrantCard";
import Link from "next/link";
import Button from "../../components/Button";
import Navbar from "../../layouts/Navbar";
import DonationList from "../../components/DonationList";

export default function Home() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = React.useState<UserProfile>();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      setLoading(true);
      axios
        .get(`/users/profile/${id}`)
        .then((res: any) => {
          setData(res.data);
        })
        .catch((err) => {
          console.error(err);
          toast.error(err.response?.data?.message || err.message, {
            toastId: "user-profile",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  return (
    <div>
      <Head>
        <title>{data ? data.name : "User Profile"} | SimpleGrants</title>
        <meta
          name="description"
          content="Join us in making an impact through quadratic funding."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col min-w-screen min-h-screen w-full h-full overflow-x-hidden text-sg-secondary">
        <Navbar className="p-4 absolute" location="grants">
          <Link href="/grants/create">
            <Button>Create Grant</Button>
          </Link>
        </Navbar>
        {loading ? (
          <></>
        ) : (
          <div className="w-full flex flex-col md:flex-row min-h-screen">
            {data ? (
              <>
                <div className="basis-full shrink-0 md:basis-1/3 lg:basis-1/4 bg-sg-gradient px-8 sm:px-12 md:px-14 pt-24 pb-6 rounded-b-xl overflow-hidden">
                  <p className="font-bold text-2xl text-sg-accent">Profile</p>
                  <div className="max-w-[8rem] aspect-square rounded-full relative overflow-hidden my-6">
                    <Image fill src={data.image} alt={data.name} />
                  </div>
                  <p className="font-bold text-xl text-sg-accent">
                    {data.name}
                  </p>
                  <p className="text-xl">{data.email}</p>
                  <p className="mt-4 my-12 line-clamp-4">{data.bio}</p>
                  <p className="font-bold text-xl text-sg-accent">
                    Total Donated Amount
                  </p>
                  <p className="text-xl mb-5">
                    ${" "}
                    {data.totalDonated.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                    })}{" "}
                    USD
                  </p>
                  <p className="font-bold text-xl text-sg-accent">
                    Total Raised Amount
                  </p>
                  <p className="text-xl">
                    ${" "}
                    {data.totalRaised.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                    })}{" "}
                    USD
                  </p>
                </div>
                <div className="basis-full shrink-0 md:basis-2/3 lg:basis-3/4 px-8 sm:px-12 md:px-14 py-20 md:pt-24 pb-6">
                  <Tabs.Root
                    className="flex flex-col w-full items-center md:items-start"
                    defaultValue="donations"
                  >
                    <Tabs.List
                      className="flex flex-row gap-x-11 font-bold text-xl mb-11"
                      aria-label="View your donations or grants"
                    >
                      <Tabs.Trigger
                        className="data-[state=active]:text-sg-accent data-[state=active]:underline"
                        value="donations"
                      >
                        Donations
                      </Tabs.Trigger>
                      <Tabs.Trigger
                        className="data-[state=active]:text-sg-accent data-[state=active]:underline"
                        value="grants"
                      >
                        Grants
                      </Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content
                      className="flex flex-col gap-10"
                      value="donations"
                    >
                      {data.contributions.map((contribution) => (
                        <DonationList
                          grant={contribution.grant}
                          contribution={contribution}
                          key={contribution.id}
                          onClick={() =>
                            router.push(`/grants/${contribution.grantId}`)
                          }
                        />
                      ))}
                    </Tabs.Content>
                    <Tabs.Content
                      className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10"
                      value="grants"
                    >
                      {data.grants.map((grant) => (
                        <GrantCard
                          grant={grant}
                          key={grant.id}
                          onClick={() => router.push(`/grants/${grant.id}`)}
                          hideButton
                        />
                      ))}
                    </Tabs.Content>
                  </Tabs.Root>
                </div>
              </>
            ) : (
              <div className="flex w-full h-full items-center justify-center min-h-screen">
                <h1 className="font-bold text-2xl">User profile not found</h1>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
