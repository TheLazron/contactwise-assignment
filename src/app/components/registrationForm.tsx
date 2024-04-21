"use client";
import { RegisterSchema } from "schemas/authSchemas";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect } from "react";
import { api } from "~/trpc/react";
import Link from "next/link";

type RegistrationSchemaType = z.infer<typeof RegisterSchema>;

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegistrationSchemaType>({
    resolver: zodResolver(RegisterSchema),
  });

  const registerUser = api.auth.register.useMutation({
    onSuccess: () => {
      toast.success("Verification Email sent. Please verify your email.");
      reset();
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (errors.email) {
      toast.warning(errors.email.message);
    }
    if (errors.password) {
      toast.warning(errors.password.message);
    }
    if (errors.name) {
      toast.warning(errors.name.message);
    }
  }, [errors.email, errors.password, errors.name]);

  const onSubmit: SubmitHandler<RegistrationSchemaType> = async (data) => {
    console.log(data);
    registerUser.mutate(data);
  };

  return (
    <div className="w-full  rounded-md	bg-base-100 shadow-lg sm:max-w-md md:mt-0 xl:p-0">
      <div className="flex w-full flex-col items-start space-y-4 p-6 sm:p-8 md:space-y-6">
        <h1 className="w-full text-xl font-bold leading-tight tracking-tight text-accent">
          Register an account
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full  space-y-4 md:space-y-3"
        >
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-primary-content"
            >
              Your Name
            </label>
            <input
              {...register("name")}
              type="text"
              name="name"
              id="name"
              className="block w-full rounded-lg border border-accent bg-base-200 p-2.5 text-primary-content focus:border-primary focus:ring-primary sm:text-sm "
              placeholder="Name"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-primary-content"
            >
              Your email
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
              placeholder="••••••••"
              className="block w-full rounded-lg border border-accent bg-base-200 p-2.5 text-primary-content focus:border-primary focus:ring-primary sm:text-sm "
              required
            />
          </div>

          <button type="submit" className="btn btn-accent w-full">
            Sign Up
          </button>
          <div className="flex items-center justify-between">
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-primary-600 dark:text-primary-500 font-medium hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
