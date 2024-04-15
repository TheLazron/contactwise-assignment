"use client";

import { FaGoogle } from "react-icons/fa";

const LoginForm = () => {
  return (
    <div className="w-full  rounded-md	bg-base-100 shadow-lg sm:max-w-md md:mt-0 xl:p-0">
      <div className="flex w-full flex-col items-start space-y-4 p-6 sm:p-8 md:space-y-6">
        <h1 className="w-full text-xl font-bold leading-tight tracking-tight text-accent">
          Sign in to your account
        </h1>
        <form
          className="w-full  space-y-4 md:space-y-3"
          onSubmit={(e) => e.preventDefault()}
        >
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-primary-content"
            >
              Your email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="block w-full rounded-lg border border-accent bg-base-200 p-2.5 text-primary-content focus:border-primary focus:ring-primary sm:text-sm "
              placeholder="name@company.com"
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
          <button className="btn btn-outline w-full">
            <FaGoogle />
            Sign in with Google
          </button>
          <div className="flex items-center justify-between">
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Don’t have an account yet?{" "}
              <a
                href="#"
                className="text-primary-600 dark:text-primary-500 font-medium hover:underline"
              >
                Sign up
              </a>
            </p>
            <a
              href="#"
              className="text-primary-600 dark:text-primary-500 text-sm font-medium hover:underline"
            >
              Forgot password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;