"use client";
import { NewPasswordSchema } from "schemas/authSchemas";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FC, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";

type NewPasswordSchemaType = z.infer<typeof NewPasswordSchema>;

const NewPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordSchemaType>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      token: "token",
    },
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      toast.error("Token not found");
      return;
    }
  }, []);

  useEffect(() => {
    if (errors.password) {
      toast.warning(errors.password.message);
    }
  }, [errors.password]);

  const changePasswordRequest = api.auth.changePassword.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Password changed successfully!");
      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000);
    },
  });

  const onSubmit: SubmitHandler<NewPasswordSchemaType> = async (data) => {
    const resetPassData = {
      ...data,
      token: token!,
    };
    changePasswordRequest.mutate(resetPassData);
  };

  return (
    <div className="w-full  rounded-md	bg-base-100 shadow-lg sm:max-w-md md:mt-0 xl:p-0">
      <div className="flex w-full flex-col items-start space-y-4 p-6 sm:p-8 md:space-y-6">
        <h1 className="w-full text-xl font-bold leading-tight tracking-tight text-accent">
          Enter your new password
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full  space-y-4 md:space-y-3"
        >
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-primary-content"
            >
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              name="password"
              id="password"
              className="block w-full rounded-lg border border-accent bg-base-200 p-2.5 text-primary-content focus:border-primary focus:ring-primary sm:text-sm "
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn-accent w-full">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPasswordForm;
