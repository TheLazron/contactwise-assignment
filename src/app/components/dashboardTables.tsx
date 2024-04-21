"use client";

import { api } from "~/trpc/react";
import { columns } from "./orgTable/columns";
import { useSession } from "next-auth/react";
import { authOptions } from "~/server/auth";
import { DataTable } from "./orgTable/dataTable";
import { getOrganisationsResponseType } from "types";
import { useEffect, useState } from "react";

const DashboardTables = () => {
  const { data: session, status: sessionStatus } = useSession();
  const [ownedOrgs, setOwnedOrgs] = useState<
    getOrganisationsResponseType[] | []
  >([]);
  const [joinedOrgs, setJoinedOrgs] = useState<
    getOrganisationsResponseType[] | []
  >([]);

  const {
    data: orgsData,
    isSuccess,
    isLoading,
    isError,
    error,
  } = api.organisation.getOrgs.useQuery();

  useEffect(() => {
    if (sessionStatus === "authenticated" && isSuccess) {
      const newOrgs =
        orgsData?.map((org) => ({
          ...org,
          currentUserId: session.user.id,
        })) || [];

      setOwnedOrgs(newOrgs.filter((org) => org.owner.id === session.user.id));
      setJoinedOrgs(newOrgs.filter((org) => org.owner.id !== session.user.id));
    }
  }, [session, sessionStatus, isLoading, orgsData, isSuccess]);

  if (sessionStatus === "unauthenticated" || isError) {
    return <div>Error: {error?.message ?? "Could not fetch session"}</div>;
  }

  return (
    <div className="mt-12 flex w-full flex-col gap-3">
      <div>
        <h1 className="lg:text-md mb-2 w-full text-[14px] font-bold leading-tight tracking-tight text-accent sm:text-[16px] md:text-[20px]">
          Created Organisations
        </h1>
        {isLoading && (
          <div className="flex w-full justify-center font-semibold">
            Loading...
          </div>
        )}
        <DataTable columns={columns} data={ownedOrgs} />
      </div>
      <div>
        <h1 className=" lg:text-md mb-2 w-full text-[14px] font-bold leading-tight tracking-tight text-accent sm:text-[16px] md:text-[20px]">
          Joined Organisations
        </h1>
        {isLoading && (
          <div className="flex w-full justify-center font-semibold">
            Loading...
          </div>
        )}
        <DataTable columns={columns} data={joinedOrgs} />
      </div>
    </div>
  );
};

export default DashboardTables;
