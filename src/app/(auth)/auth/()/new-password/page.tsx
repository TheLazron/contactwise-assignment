import { Suspense } from "react";
import NewPasswordForm from "~/app/components/newPassForm";
import ResetPassForm from "~/app/components/resetPassForm";

const LoginPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          <span className="loading loading-infinity loading-lg mt-6 text-secondary"></span>
        </div>
      }
    >
      <NewPasswordForm />;
    </Suspense>
  );
};

export default LoginPage;
