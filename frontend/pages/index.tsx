import Head from "next/head";
import { useSession } from "next-auth/react";
import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-react";
import React from "react";
import Image from "next/image";
import LandingNavbar from "../layouts/landing/LandingNavbar";
import Button from "../components/Button";
import { useRouter } from "next/router";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import GrantCard from "../components/GrantCard";
import { GrantResponse } from "../types/grant";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import Fade from "react-reveal/Fade";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [data, setData] = React.useState<GrantResponse[]>([]);
  const [loading, setLoading] = React.useState(false);
  const { getData } = useVisitorData({ tag: "signin" }, { immediate: false });

  React.useEffect(() => {
    const saveFingerprintData = async () => {
      getData().then((res) => {
        fetch("/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            user: res.visitorId,
          }),
        });
      });
    };

    if (session) {
      saveFingerprintData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const getGrants = () => {
    setLoading(true);
    axios
      .get("/grants")
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error({ err });
        toast.error(err.message || "Something went wrong", {
          toastId: "retrieve-grants-error",
        });
      })
      .finally(() => setLoading(false));
  };

  React.useEffect(() => {
    getGrants();
  }, []);

  return (
    <div>
      <Head>
        <title>SimpleGrants</title>
        <meta
          name="description"
          content="Join us in making an impact through quadratic funding."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col min-w-screen min-h-screen w-full h-full overflow-x-hidden">
        <LandingNavbar className="z-[2] absolute top-0 left-0" />
        <div className="flex flex-col w-full items-center justify-center min-h-[60vh] text-center bg-sg-primary px-2">
          <Fade bottom distance="15px">
            <h1 className="font-bold text-3xl md:text-5xl max-w-2xl md:leading-snug">
              Empowering the next generation of changemakers
            </h1>
            <p className="mt-3 text-lg md:text-xl">
              Join us in making an impact through quadratic funding.
            </p>
          </Fade>
        </div>
        <div className="relative flex w-full -translate-y-[57%]">
          <Image
            src="/assets/abstract.svg"
            width={1920}
            height={384}
            alt="abstract"
            className="scale-200 md:scale-150 lg:scale-125 w-screen"
          />
        </div>
        <section className="px-8 md:px-18 lg:px-36">
          <h2 className="font-bold text-3xl md:text-5xl mt-12 lg:mt-0 mb-5">
            How does SimpleGrants work?
          </h2>
          <p className="mb-28 max-w-3xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            imperdiet scelerisque augue. In quis posuere nisl. Sed a commodo
            massa. Praesent eu scelerisque libero, sit amet vulputate arcu. Cras
            aliquam sit amet odio ut pulvinar. Praesent non dapibus nulla. Etiam
            a sem tristique, tincidunt est eget, ornare lorem.
          </p>

          <div className="flex flex-wrap w-full items-center justify-center gap-x-12 gap-y-8">
            <div className="flex flex-col h-full w-full max-w-[350px] px-9 py-12 bg-[linear-gradient(90deg,_#E4F3DD_17.22%,_#FFE0DB_96.29%)] rounded-2xl border border-[#D9A596]">
              <p className="font-bold text-3xl mb-10">Donate</p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                imperdiet scelerisque augue. In quis posuere nisl. Sed a commodo
                massa. Praesent eu scelerisque libero, sit amet vulputate arcu.
                Cras aliquam sit amet odio ut pulvinar. Praesent non dapibus
                nulla. Etiam a sem tristique, tincidunt est eget, ornare lorem.
              </p>
            </div>
            <div className="flex flex-col h-full w-full max-w-[350px] px-9 py-12 bg-[linear-gradient(90deg,_#FFE0DB_26.25%,_#FFE1A7_100%)] rounded-2xl border border-[#D9A596]">
              <p className="font-bold text-3xl mb-10">Create</p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                imperdiet scelerisque augue. In quis posuere nisl. Sed a commodo
                massa. Praesent eu scelerisque libero, sit amet vulputate arcu.
                Cras aliquam sit amet odio ut pulvinar. Praesent non dapibus
                nulla. Etiam a sem tristique, tincidunt est eget, ornare lorem.
              </p>
            </div>
            <div className="flex flex-col h-full w-full max-w-[350px] px-9 py-12 bg-[linear-gradient(90deg,_#FFE1A7_0.79%,_#E5F4DE_97.08%)] rounded-2xl border border-[#D9A596]">
              <p className="font-bold text-3xl mb-10">Contribute</p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                imperdiet scelerisque augue. In quis posuere nisl. Sed a commodo
                massa. Praesent eu scelerisque libero, sit amet vulputate arcu.
                Cras aliquam sit amet odio ut pulvinar. Praesent non dapibus
                nulla. Etiam a sem tristique, tincidunt est eget, ornare lorem.
              </p>
            </div>
          </div>
          <div className="flex w-full items-center justify-center mt-16 mb-28">
            <Button onClick={() => router.push("/get-started")}>
              Get Started
            </Button>
          </div>
        </section>
        <section className="px-8 md:px-18 lg:px-36">
          <h2 className="font-bold text-3xl md:text-5xl mt-12 lg:mt-0 mb-16">
            What is quadratic funding?
          </h2>
          <div className="flex w-full items-center justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-14">
              <div className="flex flex-col md:flex-row h-full w-full px-8 py-14 md:items-center rounded-2xl bg-white border border-[#D9A596] gap-6">
                <div className="relative flex w-full h-full flex-grow items-stretch min-h-[150px] md:flex-1">
                  <Image
                    src="/assets/quadratic-funding.png"
                    alt="Quadratic funding"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <p className="font-bold text-2xl">Quadratic Funding</p>
                  <p>
                    is the mathematically optimal way to fund public goods in a
                    democratic community.
                  </p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row h-full w-full px-8 py-14 md:items-center rounded-2xl bg-white border border-[#D9A596] gap-6">
                <div className="relative flex w-full h-full min-h-[150px] md:flex-1">
                  <Image
                    src="/assets/matching-pool.png"
                    alt="matching-pool"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <p className="font-bold text-2xl">A matching pool </p>
                  <p>campaign is matched according to the QF algorithm.</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row h-full w-full px-8 py-14 md:items-center rounded-2xl bg-white border border-[#D9A596] gap-6">
                <div className="relative flex w-full h-full min-h-[150px] md:flex-1">
                  <Image
                    src="/assets/contributors.png"
                    alt="contributors"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <p className="font-bold text-2xl">Number of contributors</p>
                  <p>matters more than amount funded.</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row h-full w-full px-8 py-14 md:items-center rounded-2xl bg-white border border-[#D9A596] gap-6">
                <div className="relative flex w-full h-full min-h-[150px] md:flex-1">
                  <Image
                    src="/assets/raised.png"
                    alt="raised"
                    fill
                    className="object-contain scale-150"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <p>
                    <span className="font-bold text-2xl inline-flex mr-2">
                      $2,827,300{" "}
                    </span>
                    raised for individuals, communities, and businesses to help
                    turn their visions into reality.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full justify-end mt-14 mb-28">
            <Button
              style="ghost"
              onClick={() => router.push("https://wtfisqf.com/")}
            >
              Learn more <ArrowTopRightIcon className="ml-2" />
            </Button>
          </div>
        </section>
        <section className="flex flex-row w-full justify-center bg-sg-primary px-8 md:px-24 lg:px-48 xl:px-96 py-28 gap-x-4">
          <p className="font-bold text-[128px] text-[#99BCD1] leading-none -translate-y-6 absolute left-0 md:relative">
            “
          </p>
          <div className="flex flex-col">
            <p className="font-bold text-4xl mb-5 z-[2] max-w-4xl">
              SimpleGrants is the best platform to get passionate funders who go
              the extra mile
            </p>
            <p>Bob Ross, Commercial Director, Homebase Labs</p>
          </div>
        </section>
        <section className="flex flex-col w-full items-center justify-center mt-24">
          <h3 className="font-bold text-3xl lg:text-5xl mb-14 text-center">
            Projects funded
          </h3>
          <div className="flex flex-col md:flex-row gap-12">
            {data &&
              data
                .slice(0, 3)
                .map((grant) => (
                  <GrantCard
                    grant={grant}
                    key={grant.id}
                    hideButton
                    onClick={() => router.push(`/grants/${grant.id}`)}
                  />
                ))}
          </div>
        </section>
        <section className="flex flex-col w-full items-center justify-center text-center mt-40">
          <h3 className="font-bold text-3xl lg:text-5xl">Make an impact</h3>
          <p className="mt-3 mb-10 text-lg md:text-xl">
            Start funding projects with as little as $1 today.
          </p>
          <Button onClick={() => router.push("/get-started")}>
            Get Started
          </Button>
        </section>
        <div className="relative flex w-full my-16">
          <Image
            src="/assets/abstract-blue.svg"
            width={1920}
            height={384}
            alt="abstract"
            className="scale-200 md:scale-150 lg:scale-125 w-screen"
          />
        </div>
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
