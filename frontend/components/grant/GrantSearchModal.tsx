import React from "react";
import {
  FilterOptions,
  GrantDetailResponse,
  GrantResponse,
  SortOptions,
} from "../../types/grant";
import clsx from "clsx";
import axios from "../../utils/axios";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import Select from "../input/Select";
import router from "next/router";
import Divider from "../Divider";
import Grid from "../icons/Grid";
import Search from "../icons/Search";
import TextInput from "../input/TextInput";
import GrantCard from "./GrantCard";
import GrantList from "./GrantList";
import { debounce as debouncer } from "lodash";
import { toast } from "react-toastify";
import List from "../icons/List";
import Button from "../Button";
import { Dialog } from "@headlessui/react";
import GrantModal from "./GrantModal";
import Close from "../icons/Close";

interface IGrantSearchModalProps {
  onClose: () => void;
  onSelect: (grant: GrantResponse) => void;
  grants: GrantResponse[];
  className?: string;
}

const GrantSearchModal = ({
  className,
  grants,
  onClose,
  onSelect,
}: IGrantSearchModalProps) => {
  const [data, setData] = React.useState<GrantResponse[]>([]);
  const [sort, setSort] = React.useState<string | undefined>(undefined);
  const [filter, setFilter] = React.useState<string | undefined>(undefined);
  const [search, setSearch] = React.useState<string | undefined>(undefined);
  const [grant, setGrant] = React.useState<GrantDetailResponse>();
  const [view, setView] = React.useState<"grid" | "list">("grid");
  const [loading, setLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

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
    <div
      className={clsx(
        className,
        "flex flex-col items-center justify-center px-4 md:px-8 w-full relative"
      )}
    >
      <div className="flex items-start justify-start w-full py-4 md:py-8">
        <p onClick={onClose} className="cursor-pointer">
          <Close className="fill-sg-secondary" />
        </p>
      </div>
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
        <p className="font-bold text-xl flex-initial">{data.length} Grants</p>
        <div className="flex flex-row items-center justify-center gap-x-3 flex-initial">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-10 w-full my-6 justify-items-center">
          {data &&
            data
              .filter(
                (grant) => !grants.some((selected) => selected.id === grant.id)
              )
              .map((grant) => (
                <GrantCard
                  className="h-full"
                  hideButton
                  grant={grant}
                  onClick={(e) => {
                    e.stopPropagation();
                    getGrant(grant.id);
                  }}
                  key={grant.id}
                >
                  <Button
                    width="full"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(grant);
                    }}
                  >
                    Add to pool
                  </Button>
                </GrantCard>
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
  );
};

export default GrantSearchModal;
