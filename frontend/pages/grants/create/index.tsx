/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import { useSession, signIn } from "next-auth/react";
import React from "react";
import MainLayout from "../../../layouts/MainLayout";
import Navbar from "../../../layouts/Navbar";
import Button from "../../../components/Button";
import { useRouter } from "next/router";
import TextInput from "../../../components/input/TextInput";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BackButton from "../../../components/BackButton";
import ImageInput from "../../../components/input/ImageInput";
import clsx from "clsx";
import TextAreaInput from "../../../components/input/TextAreaInput";
import axios from "../../../utils/axios";
import { useGrantStore } from "../../../utils/store";
import { toast } from "react-toastify";

const validationSchema = z.object({
  name: z.string().min(1, { message: "Grant name is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  twitter: z.string().optional(),
  website: z
    .string()
    .min(1, { message: "Website link is required" })
    .url("Must be a valid link"),
  image: z
    .any()
    .refine((file) => !!file, "Image is required")
    .refine((file) => file?.size <= 2000000, `Max file size is 20MB.`),
  description: z.string().min(1, { message: "Grant description is required" }),
  fundingGoal: z
    .number()
    .min(1, { message: "Funding goal must be at least $1" }),
  paymentAccount: z.string().min(1, { message: "Payment account is required" }),
});

type ValidationSchema = z.infer<typeof validationSchema>;

export default function CreateGrant() {
  const router = useRouter();
  const { saveGrant } = useGrantStore();
  const { data: session, status } = useSession();
  const [loading, setLoading] = React.useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/sign-in");
    }
  }, [status]);

  const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {
    setLoading(true);

    const formData = new FormData();
    for (const key in data) {
      formData.set(key, data[key as keyof ValidationSchema]);
    }

    axios
      .post("/grants", formData)
      .then((res) => {
        saveGrant(res.data);
        toast.success("Grant created successfully!");
        router.push("/grants/create/success");
      })
      .catch((err) => {
        console.error(err);
        toast.error(
          err.response?.data?.message || err.message || "Something went wrong"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
        <Navbar className="p-0" location="grants" />
        <form
          className="flex flex-col items-start justify-center px-8 my-2 w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <BackButton href="/grants">Back to grants</BackButton>
          <div className="w-full flex flex-col my-10 gap-y-8">
            <div className=" bg-white shadow-card py-8 px-6 rounded-xl w-full">
              <h1 className="font-bold text-subtitle-1 mb-8">Create Grant</h1>
              <div className="flex flex-col md:flex-row w-full gap-11">
                <div className="relative h-full basis-[2/5] w-full">
                  <ImageInput
                    className={clsx(
                      "aspect-[3/2] object-cover w-full h-full border"
                    )}
                    id="image"
                    errors={errors}
                    onChange={(value: any) => {
                      setValue("image", value, { shouldValidate: true });
                    }}
                  />
                </div>
                <div className="flex flex-col basis-[3/5] w-full gap-y-6">
                  <div className="form-control w-full">
                    <label className="label mt-0 pt-0">
                      <span className="label-text font-bold text-lg">
                        Grant Name
                      </span>
                    </label>
                    <TextInput
                      className={clsx("w-full")}
                      errors={errors}
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
                    <TextInput
                      type="text"
                      className={clsx("w-full")}
                      errors={errors}
                      id="location"
                      register={register}
                    />
                  </div>
                  <div className="flex flex-col md:flex-row w-full gap-y-6 gap-x-4 lg:gap-x-10">
                    <div className="form-control w-full flex-1">
                      <label className="label">
                        <span className="label-text font-bold text-lg">
                          Twitter Handle{" "}
                          <small className="font-normal text-sm">
                            (Optional)
                          </small>
                        </span>
                      </label>
                      <TextInput
                        type="text"
                        className={clsx("w-full")}
                        errors={errors}
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
                      <TextInput
                        type="text"
                        className={clsx("w-full")}
                        errors={errors}
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
                <TextAreaInput
                  id="description"
                  register={register}
                  errors={errors}
                />
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
                  <TextInput
                    type="number"
                    className={clsx("w-full")}
                    errors={errors}
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
                  <TextInput
                    type="text"
                    className={clsx("w-full")}
                    errors={errors}
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
              <Button
                className="mt-6"
                onClick={handleSubmit(onSubmit)}
                disabled={loading}
              >
                Create Grant
              </Button>
            </div>
          </div>
        </form>
      </MainLayout>
    </div>
  );
}
