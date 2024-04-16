"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { api } from "~/trpc/react";

const VerifytokenPage = () => {
  // const a = api.auth.verifyToken();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      toast.error("Token not found");
      return;
    }
    verifyToken.mutate({ token });
  }, []);

  const verifyToken = api.auth.verifyToken.useMutation({
    onSuccess(data, variables, context) {
      toast.success("Email Verified");
      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000);
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  return (
    <div className="modal-backdrop  w-full self-center">
      <dialog className=" modal  modal-open modal-bottom sm:modal-middle	">
        <div className="glass modal-box bg-neutral-content text-center text-primary-content">
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-xs font-bold text-secondary-content sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl">
              Awaiting Verification
            </h3>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg ">
              Please wait while we verify your email
            </p>
            <span className="loading loading-infinity loading-lg mt-6 text-secondary"></span>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default VerifytokenPage;
