"use client";

import { api } from "~/trpc/react";
import { columns } from "./orgTable/columns";
import { useSession } from "next-auth/react";
import { authOptions } from "~/server/auth";
import { DataTable } from "./orgTable/dataTable";
import { getOrganisationsResponseType } from "types";

const DashboardTables = () => {
  const { data: session, status, update } = useSession();
  console.log("session", session);

  const res = api.organisation.getOrgs.useQuery();

  const orgs = res?.data?.map((org) => ({
    ...org,
    currentUserId: session!.user.id,
  }));

  const ownedOrgs = orgs?.filter((org) => org.owner.id === session!.user.id);
  const joinedOrgs = orgs?.filter((org) => org.owner.id !== session!.user.id);

  return (
    <div className="mt-12 flex w-full flex-col gap-3">
      <div>
        <h1 className="lg:text-md mb-2 w-full text-[14px] font-bold leading-tight tracking-tight text-accent sm:text-[16px] md:text-[20px]">
          Created Organisations
        </h1>
        <DataTable columns={columns} data={ownedOrgs!} />
      </div>
      <div>
        <h1 className=" lg:text-md mb-2 w-full text-[14px] font-bold leading-tight tracking-tight text-accent sm:text-[16px] md:text-[20px]">
          Joined Organisations
        </h1>
        <DataTable columns={columns} data={joinedOrgs!} />
      </div>
    </div>
  );
};

export default DashboardTables;
