/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import { useSession, signIn } from "next-auth/react";
import React from "react";
import MainLayout from "../../layouts/MainLayout";
import Navbar from "../../layouts/Navbar";
import Button from "../../components/Button";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import Input from "../../components/Input";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const validationSchema = z.object({
  name: z.string().min(1, { message: "Grant name is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  twitter: z.string().optional(),
  website: z
    .string()
    .min(1, { message: "Website link is required" })
    .url("Must be a valid link"),
  image: z
    .string()
    .min(1, { message: "Image is required" })
    .url("Invalid image upload"),
  description: z.string().min(1, { message: "Grant description is required" }),
  fundingGoal: z
    .number()
    .min(1, { message: "Funding goal must be at least $1" }),
  paymentAccount: z.string().min(1, { message: "Payment account is required" }),
});

type ValidationSchema = z.infer<typeof validationSchema>;

export default function CreateGrant() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status]);

  const onSubmit: SubmitHandler<ValidationSchema> = (data) => console.log(data);

  console.log(errors);

  return (
    <div>
      <Head>
        <title>Create Grant | SimpleGrants</title>
        <meta
          name="description"
          content="Join us in making an impact through quadratic funding."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout>
        <Navbar className="p-0" />
        <form
          className="flex flex-col items-start justify-center px-8 my-2 w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Link href="/grants">&lt; Back to grants</Link>
          <div className="w-full flex flex-col my-10 gap-y-8">
            <div className=" bg-white shadow-card py-8 px-6 rounded-xl w-full">
              <h1 className="font-bold text-subtitle-1 mb-8">Create Grant</h1>
              <div className="flex flex-col md:flex-row w-full gap-11">
                <div className="relative h-full rounded-lg overflow-hidden basis-[2/5] w-full">
                  <Image
                    alt="image"
                    src={"https://picsum.photos/seed/1000/600"}
                    width={500}
                    height={300}
                    className="aspect-[3/2] object-cover w-full"
                  />
                </div>
                <div className="flex flex-col basis-[3/5] w-full gap-y-6">
                  <div className="form-control w-full">
                    <label className="label mt-0 pt-0">
                      <span className="label-text font-bold text-lg">
                        Grant Name
                      </span>
                    </label>
                    {/* <Input
                      type="text"
                      className="w-full"
                      id="name"
                      register={register}
                    /> */}
                    <Input
                      className="w-full"
                      id="name"
                      type="text"
                      register={register}
                    />
                  </div>
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-bold text-lg">
                        Location
                      </span>
                    </label>
                    <Input
                      type="text"
                      className="w-full"
                      id="location"
                      register={register}
                    />
                  </div>
                  <div className="flex flex-col md:flex-row w-full gap-y-6 gap-x-4 lg:gap-x-10">
                    <div className="form-control w-full flex-1">
                      <label className="label">
                        <span className="label-text font-bold text-lg">
                          Twitter Handle
                        </span>
                      </label>
                      <Input
                        type="text"
                        className="w-full"
                        id="twitter"
                        register={register}
                      />
                    </div>
                    <div className="form-control w-full flex-1">
                      <label className="label">
                        <span className="label-text font-bold text-lg">
                          Website
                        </span>
                      </label>
                      <Input
                        type="text"
                        className="w-full"
                        id="website"
                        register={register}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-control w-full flex-1 mt-12">
                <label className="label">
                  <span className="label-text font-bold text-lg">
                    Grant Description
                  </span>
                </label>
                <textarea
                  rows={8}
                  className="border border-sg-200 w-full h-full focus:border-sg-primary rounded-lg px-5 py-4 outline-none"
                  id="description"
                  {...register("description")}
                ></textarea>
              </div>
              {/* <p className="mt-12">{data.description}</p> */}
            </div>
            <div className=" bg-white shadow-card py-8 px-6 rounded-xl w-full flex flex-col md:flex-row gap-8">
              <div className="flex flex-col flex-1 w-full gap-y-8">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-bold text-lg">
                      Funding Goal
                    </span>
                  </label>
                  <Input
                    type="number"
                    className="w-full"
                    id="fundingGoal"
                    register={register}
                  />
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-bold text-lg">
                      Payment Account
                    </span>
                  </label>
                  <Input
                    type="text"
                    className="w-full"
                    id="paymentAccount"
                    register={register}
                  />
                </div>
              </div>
              <div className="flex flex-col flex-1 w-full gap-y-5">
                <p className="font-bold text-lg">Team Members</p>
                <div className="flex flex-row w-full items-center justify-between">
                  <p>{session && session.user?.email}</p>
                  <p>Owner</p>
                </div>
                <p className="font-bold text-lg">+ Add a team member</p>
              </div>
            </div>
            <div className="flex flex-col w-full items-center justify-center">
              <Button className="mt-6" onClick={handleSubmit(onSubmit)}>
                Create Grant
              </Button>
            </div>
          </div>
        </form>
      </MainLayout>
    </div>
  );
}
