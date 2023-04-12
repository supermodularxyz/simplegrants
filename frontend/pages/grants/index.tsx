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
import Select from "../../components/input/Select";
import Divider from "../../components/Divider";
import GrantCard from "../../components/grant/GrantCard";
import { useRouter } from "next/router";
import TextInput from "../../components/input/TextInput";
import Search from "../../components/icons/Search";
import Grid from "../../components/icons/Grid";
import List from "../../components/icons/List";
import GrantList from "../../components/grant/GrantList";
import { debounce as debouncer } from "lodash";

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedOnChange = React.useCallback(
    debouncer((value) => {
      setSearch(value);
    }, 500),
    [setSearch]
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedOnChange(event.target.value);
  };

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
          <Link href="/grants/create">
            <Button>Create Grant</Button>
          </Link>
        </Navbar>
        <div className="flex flex-col items-center justify-center px-8 my-20 w-full">
          <div className="flex flex-row w-full items-center justify-center mb-8">
            <TextInput
              type="text"
              placeholder="Search"
              onChange={handleChange}
              className="max-w-xl"
              icon={<Search className="fill-sg-900" />}
            />
          </div>
          <div className="flex flex-col lg:flex-row w-full items-end lg:items-center justify-between gap-y-4">
            <p className="font-bold text-xl flex-initial">
              {data.length} Grants
            </p>
            <div className="flex flex-row gap-x-3 w-full flex-1 justify-end mr-0 lg:mr-3">
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
            </div>
            <div className="flex flex-row items-center justify-center gap-x-3 flex-initial">
              <Divider orientation="vertical" />
              <ToggleGroup.Root
                className="items-center flex flex-row gap-x-1"
                type="single"
                defaultValue="grid"
                value={view}
                aria-label="Text alignment"
                onValueChange={(value: "grid" | "list") => {
                  if (value) setView(value);
                }}
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
          {view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-y-8 gap-x-10 w-full my-6 justify-items-center">
              {data &&
                data.map((grant) => (
                  <GrantCard
                    hideButton={!session}
                    grant={grant}
                    onClick={() => router.push(`/grants/${grant.id}`)}
                    key={grant.id}
                  />
                ))}
            </div>
          ) : (
            <div className="flex flex-col gap-y-8 gap-x-10 w-full max-w-7xl my-6">
              {data &&
                data.map((grant) => (
                  <GrantList
                    grant={grant}
                    onClick={() => router.push(`/grants/${grant.id}`)}
                    key={grant.id}
                  />
                ))}
            </div>
          )}
        </div>
      </MainLayout>
    </div>
  );
}
