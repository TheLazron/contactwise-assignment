"use client";
import { ResetPasswordSchema } from "schemas/authSchemas";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FC, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "~/trpc/react";

type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;

const ResetPassForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
  });
  const router = useRouter();

  useEffect(() => {
    if (errors.email) {
      toast.warning(errors.email.message);
    }
  }, [errors]);

  const resetPasswordRequest = api.auth.resetPassword.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: (data) => {
      if (data) {
        toast.success("Reset link sent to your email");
      }
    },
  });

  const onSubmit: SubmitHandler<ResetPasswordSchemaType> = async (data) => {
    resetPasswordRequest.mutate(data);
  };

  return (
    <div className="w-full  rounded-md	bg-base-100 shadow-lg sm:max-w-md md:mt-0 xl:p-0">
      <div className="flex w-full flex-col items-start space-y-4 p-6 sm:p-8 md:space-y-6">
        <h1 className="w-full text-xl font-bold leading-tight tracking-tight text-accent">
          Forgot your password?
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full  space-y-4 md:space-y-3"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-primary-content"
            >
              Enter your email
            </label>
            <input
              {...register("email")}
              type="email"
              name="email"
              id="email"
              className="block w-full rounded-lg border border-accent bg-base-200 p-2.5 text-primary-content focus:border-primary focus:ring-primary sm:text-sm "
              placeholder="name@domain.com"
              required
            />
          </div>

          <button type="submit" className="btn btn-accent w-full">
            Send Reset Link
          </button>

          <div className="flex items-center justify-between">
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Don’t have an account yet?{" "}
              <Link
                href="/auth/signup"
                className="text-primary-600 dark:text-primary-500 font-medium hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassForm;
