"use client";

import { signOut } from "next-auth/react";

const SignoutDialog = () => {
  return (
    <div className="w-full  rounded-md	bg-base-100 shadow-lg sm:max-w-md md:mt-0 xl:p-0">
      <div className="flex w-full flex-col items-start space-y-4 p-6 sm:p-8 md:space-y-6">
        <h1 className="w-full text-xl font-bold leading-tight tracking-tight text-accent">
          Sign Out
        </h1>
        <button
          onClick={async () => {
            await signOut({
              callbackUrl: "/",
              redirect: true,
            });
          }}
          type="submit"
          className="btn btn-accent w-full"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default SignoutDialog;
