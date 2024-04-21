"use client";
import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import { LoginSchema } from "schemas";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FC, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type LoginSchemaType = z.infer<typeof LoginSchema>;

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
  });
  const router = useRouter();

  useEffect(() => {
    if (errors.email) {
      toast.warning(errors.email.message);
    }
    if (errors.password) {
      toast.warning(errors.password.message);
    }
  }, [errors]);

  const onSubmit: SubmitHandler<LoginSchemaType> = async (data) => {
    console.log(data);
    const response = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    response?.status === 403
      ? toast.info("Email not verified. Verification Email sent")
      : response?.status === 200
        ? router.push("/dashboard")
        : toast.error("Invalid credentials");
  };

  return (
    <div className="w-full  rounded-md	bg-base-100 shadow-lg sm:max-w-md md:mt-0 xl:p-0">
      <div className="flex w-full flex-col items-start space-y-4 p-6 sm:p-8 md:space-y-6">
        <h1 className="w-full text-xl font-bold leading-tight tracking-tight text-accent">
          Sign in to your account
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
            Sign In
          </button>
          <div className="divider">OR</div>
          <button
            className="btn btn-outline w-full"
            onClick={async () => {
              reset();
              await signIn("google", {
                callbackUrl: "/dashboard",
              });
            }}
          >
            <FaGoogle />
            Sign in with Google
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
            <Link
              href="/auth/reset-password"
              className="text-primary-600 dark:text-primary-500 text-sm font-medium hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
