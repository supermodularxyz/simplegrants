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
import { FilterOptions, GrantResponse, SortOptions } from "../../types/grant";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import Select from "../../components/Select";
import Divider from "../../components/Divider";
import Card from "../../components/Card";
import { useRouter } from "next/router";
import Input from "../../components/Input";

export default function Grants() {
  const router = useRouter();
  const { data: session } = useSession();
  const [data, setData] = React.useState<GrantResponse[]>([]);
  const [sort, setSort] = React.useState<string | undefined>(undefined);
  const [filter, setFilter] = React.useState<string | undefined>(undefined);
  const [search, setSearch] = React.useState<string | undefined>(undefined);
  const [loading, setLoading] = React.useState(false);

  const getGrants = () => {
    setLoading(true);
    axios
      .get("/grants", {
        params: {
          sort,
          filter,
          search,
        },
      })
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

  React.useEffect(() => {
    getGrants();
  }, [sort, filter, search]);

  console.log(search);

  return (
    <div>
      <Head>
        <title>Grants | SimpleGrants</title>
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
        <div className="flex flex-col items-center justify-center px-8 my-20 w-full">
          <div className="flex flex-row w-full items-center justify-center mb-8">
            <Input
              type="text"
              placeholder="Search"
              onChange={setSearch}
              className="px-7 py-4 max-w-xl"
              icon={
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.625 14.875L12.875 11.125C13.7188 9.875 14.1562 8.3125 13.9375 6.625C13.5312 3.75 11.1875 1.4375 8.34375 1.0625C4.09375 0.53125 0.5 4.125 1.03125 8.375C1.40625 11.2188 3.71875 13.5625 6.59375 13.9688C8.28125 14.1875 9.84375 13.75 11.125 12.9062L14.8438 16.6562C15.3438 17.125 16.125 17.125 16.625 16.6562C17.0938 16.1562 17.0938 15.375 16.625 14.875ZM3.46875 7.5C3.46875 5.3125 5.25 3.5 7.46875 3.5C9.65625 3.5 11.4688 5.3125 11.4688 7.5C11.4688 9.71875 9.65625 11.5 7.46875 11.5C5.25 11.5 3.46875 9.71875 3.46875 7.5Z"
                    fill="#413A34"
                  />
                </svg>
              }
            />
          </div>
          <div className="flex flex-row w-full items-center justify-between">
            <p className="font-bold text-xl">{data.length} Grants</p>
            <div className="flex flex-row items-center justify-center gap-x-3">
              <Select
                label="Sort"
                options={SortOptions}
                onValueChange={setSort}
              />
              <Select
                label="Filter"
                options={FilterOptions}
                onValueChange={setFilter}
              />
              <Divider orientation="vertical" />
              <ToggleGroup.Root
                className="items-center flex flex-row gap-x-1"
                type="single"
                defaultValue="grid"
                aria-label="Text alignment"
              >
                <ToggleGroup.Item
                  className="data-[state=on]:bg-sg-200 p-2 rounded-lg"
                  value="grid"
                  aria-label="Grid View"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 4.22222C2 2.99492 2.99492 2 4.22222 2H8.66667C9.89397 2 10.8889 2.99492 10.8889 4.22222V8.66667C10.8889 9.89397 9.89397 10.8889 8.66667 10.8889H4.22222C2.99492 10.8889 2 9.89397 2 8.66667V4.22222Z"
                      fill="#193154"
                    />
                    <path
                      d="M13.1111 4.22222C13.1111 2.99492 14.106 2 15.3333 2H19.7778C21.0051 2 22 2.99492 22 4.22222V8.66667C22 9.89397 21.0051 10.8889 19.7778 10.8889H15.3333C14.106 10.8889 13.1111 9.89397 13.1111 8.66667V4.22222Z"
                      fill="#193154"
                    />
                    <path
                      d="M13.1111 15.3333C13.1111 14.106 14.106 13.1111 15.3333 13.1111H19.7778C21.0051 13.1111 22 14.106 22 15.3333V19.7778C22 21.0051 21.0051 22 19.7778 22H15.3333C14.106 22 13.1111 21.0051 13.1111 19.7778V15.3333Z"
                      fill="#193154"
                    />
                    <path
                      d="M2 15.3333C2 14.106 2.99492 13.1111 4.22222 13.1111H8.66667C9.89397 13.1111 10.8889 14.106 10.8889 15.3333V19.7778C10.8889 21.0051 9.89397 22 8.66667 22H4.22222C2.99492 22 2 21.0051 2 19.7778V15.3333Z"
                      fill="#193154"
                    />
                  </svg>
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  className="data-[state=on]:bg-sg-200 p-2 rounded-lg"
                  value="list"
                  aria-label="List View"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.125 2.25C4.73438 2.25 5.25 2.76562 5.25 3.375V5.625C5.25 6.28125 4.73438 6.75 4.125 6.75H1.875C1.21875 6.75 0.75 6.28125 0.75 5.625V3.375C0.75 2.76562 1.21875 2.25 1.875 2.25H4.125ZM22.5 3C23.2969 3 24 3.70312 24 4.5C24 5.34375 23.2969 6 22.5 6H9C8.15625 6 7.5 5.34375 7.5 4.5C7.5 3.70312 8.15625 3 9 3H22.5ZM22.5 10.5C23.2969 10.5 24 11.2031 24 12C24 12.8438 23.2969 13.5 22.5 13.5H9C8.15625 13.5 7.5 12.8438 7.5 12C7.5 11.2031 8.15625 10.5 9 10.5H22.5ZM22.5 18C23.2969 18 24 18.7031 24 19.5C24 20.3438 23.2969 21 22.5 21H9C8.15625 21 7.5 20.3438 7.5 19.5C7.5 18.7031 8.15625 18 9 18H22.5ZM0.75 10.875C0.75 10.2656 1.21875 9.75 1.875 9.75H4.125C4.73438 9.75 5.25 10.2656 5.25 10.875V13.125C5.25 13.7812 4.73438 14.25 4.125 14.25H1.875C1.21875 14.25 0.75 13.7812 0.75 13.125V10.875ZM4.125 17.25C4.73438 17.25 5.25 17.7656 5.25 18.375V20.625C5.25 21.2812 4.73438 21.75 4.125 21.75H1.875C1.21875 21.75 0.75 21.2812 0.75 20.625V18.375C0.75 17.7656 1.21875 17.25 1.875 17.25H4.125Z"
                      fill="#193154"
                    />
                  </svg>
                </ToggleGroup.Item>
              </ToggleGroup.Root>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-10 w-full my-6">
            {data &&
              data.map((grant) => (
                <Card
                  grant={grant}
                  onClick={() => router.push(`/grants/${grant.id}`)}
                  key={grant.id}
                />
              ))}
          </div>
        </div>
      </MainLayout>
    </div>
  );
}
