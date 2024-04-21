import { columns } from "../../components/orgTable/columns";
import { DataTable } from "../../components/orgTable/dataTable";
import { z } from "zod";
import { NavigationMenuDemo } from "~/app/components/orgAction";
import { getServerSession } from "next-auth";
import { createSSRHelper } from "~/trpc/server";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { Organisation } from "@prisma/client";
import { useState } from "react";
import { authOptions, getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import DashboardTables from "~/app/components/dashboardTables";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const session = await getServerAuthSession();
  if (!session?.user) {
    redirect("/auth/signin");
  }
  const helpers = await createSSRHelper();
  await helpers.organisation.getOrgs.prefetch();
  const dehydrateState = dehydrate(helpers.queryClient);
  return (
    <HydrationBoundary state={dehydrateState}>
      <div className="container mt-24 flex min-h-screen flex-col  bg-base-100 bg-opacity-70 px-0 py-10">
        <div className="flex w-full justify-end">
          <NavigationMenuDemo />
        </div>
        <DashboardTables />
      </div>
    </HydrationBoundary>
  );
};

export default DashboardPage;
