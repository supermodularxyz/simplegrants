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
import Search from "../../components/icons/Search";
import Grid from "../../components/icons/Grid";
import List from "../../components/icons/List";

export default function Grants() {
  const router = useRouter();
  const { data: session } = useSession();
  const [data, setData] = React.useState<GrantResponse[]>([]);
  const [sort, setSort] = React.useState<string | undefined>(undefined);
  const [filter, setFilter] = React.useState<string | undefined>(undefined);
  const [search, setSearch] = React.useState<string | undefined>(undefined);
  const [view, setView] = React.useState<"grid" | "list">("grid");
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
              icon={<Search className="fill-sg-900" />}
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
                  <Grid className="fill-[#193154]" />
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  className="data-[state=on]:bg-sg-200 p-2 rounded-lg"
                  value="list"
                  aria-label="List View"
                >
                  <List className="fill-[#193154]" />
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
