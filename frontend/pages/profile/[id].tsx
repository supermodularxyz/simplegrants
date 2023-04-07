import Head from "next/head";
import { useSession } from "next-auth/react";
import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-react";
import React from "react";
import Image from "next/image";
import LandingNavbar from "../../layouts/landing/LandingNavbar";
import Button from "../../components/Button";
import { useRouter } from "next/router";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import GrantCard from "../../components/GrantCard";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import Fade from "react-reveal/Fade";
import { UserProfile } from "../../types/user";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  const { id } = router.query;
  const [data, setData] = React.useState<UserProfile>();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      setLoading(true);
      axios
        .get(`/profile/${id}`)
        .then((res: any) => setData(res))
        .catch((err) => {
          console.error(err);
          toast.error(err.response.data.message, {
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

      <main className="flex flex-col min-w-screen min-h-screen w-full h-full overflow-x-hidden">
        <LandingNavbar className="z-[2] absolute top-0 left-0" />
        {loading ? (
          <></>
        ) : (
          <>{data ? <></> : <h1>User profile not found</h1>}</>
        )}
        <footer className="w-full flex flex-col md:flex-row px-6 py-8 md:px-28 md:py-16 gap-x-14 justify-between items-start">
          <div className="w-full">
            <Image
              src="/logo.svg"
              alt="SimpleGrants"
              width={162}
              height={50}
              className="mb-8"
            />
          </div>
          <div className="flex flex-row flex-wrap lg:flex-nowrap gap-x-8 w-full justify-between">
            <div className="flex flex-col gap-y-3 mb-6">
              <p className="font-bold text-xl">Product</p>
              <p className="font-sm">Grants</p>
              <p className="font-sm">Ecosystems</p>
            </div>
            <div className="flex flex-col gap-y-3 mb-6">
              <p className="font-bold text-xl">Organization</p>
              <p className="font-sm">About</p>
              <p className="font-sm">Mission</p>
              <p className="font-sm">Blog</p>
            </div>
            <div className="flex flex-col gap-y-3 mb-6">
              <p className="font-bold text-xl">Community</p>
              <p className="font-sm">Code of Conduct</p>
              <p className="font-sm">Support</p>
            </div>
            <div className="flex flex-col gap-y-3 mb-6">
              <p className="font-bold text-xl">Legal</p>
              <p className="font-sm">Terms</p>
              <p className="font-sm">Privacy</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
