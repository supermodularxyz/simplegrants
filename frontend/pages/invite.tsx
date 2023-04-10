import { useSession } from "next-auth/react";
import Head from "next/head";
import React from "react";
import MainLayout from "../layouts/MainLayout";
import Button from "../components/Button";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import clsx from "clsx";
import TextInput from "../components/input/TextInput";
import { useInviteStore } from "../utils/store";
import Link from "next/link";

const validationSchema = z.object({
  code: z.string().min(1, { message: "Invite code is required" }),
});

type ValidationSchema = z.infer<typeof validationSchema>;

export default function GetStarted() {
  const { inviteCode, saveInvite, clearInvite } = useInviteStore();
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = React.useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {
    saveInvite(data.code);
    router.push("/sign-in");
  };

  const claimInviteCode = async () => {
    setLoading(true);

    axios
      .post(`/invites/${inviteCode}`)
      .then(() => {
        toast.success("Account created successfully!");
        router.push("/ecosystem-builder");
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response.data.message, {
          toastId: "ecosystem-builder",
        });
      })
      .finally(() => {
        setLoading(false);
        clearInvite();
      });
  };

  React.useEffect(() => {
    if (inviteCode && session) {
      claimInviteCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inviteCode, session]);

  return (
    <div>
      <Head>
        <title>Be an Ecosystem Builder | SimpleGrants</title>
        <meta
          name="description"
          content="Join us in making an impact through quadratic funding."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout className="items-center justify-center">
        <div className="flex flex-col items-center justify-between h-full rounded-lg bg-white p-8 shadow-card">
          <h1 className="font-bold text-xl">Enter Invite Code</h1>
          <form
            className="flex flex-col items-center justify-center w-full"
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextInput
              className={clsx("w-full my-8")}
              errors={errors}
              id="code"
              type="text"
              register={register}
            />
            <Button
              disabled={loading}
              onClick={handleSubmit(onSubmit)}
              className="px-16 py-3 text-xl w-full"
              width="full"
            >
              Next
            </Button>
          </form>
          <div className="mt-8 mb-4 flex flex-col w-full items-center justify-center text-sm">
            <p className="text-center">Already an ecosystem builder?</p>
            <Link
              href="/ecosystem-builder"
              className="underline text-sg-secondary text-center"
            >
              Click here to access the ecosystem builder platform
            </Link>
          </div>
        </div>
      </MainLayout>
    </div>
  );
}
