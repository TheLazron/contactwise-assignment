import { TrashIcon } from "@radix-ui/react-icons";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import { membersTableDataType } from "types";
import DeleteOrgModal from "~/app/components/deleteOrgModal";
import EditOrgModal from "~/app/components/editOrgModal";
import columns from "~/app/components/membersTable/columns";
import { MembersTable } from "~/app/components/membersTable/dataTable";
import OrganisationPageContent from "~/app/components/organisationPageContent";
import { authOptions } from "~/server/auth";
import { api, createSSRHelper } from "~/trpc/server";

const OrganisationPage = async ({ params }: { params: { orgId: string } }) => {
  const memberObject = await api.member.getRole({ orgId: params.orgId });
  const data = await api.organisation.getOrg({ orgId: params.orgId });

  const helpers = await createSSRHelper();
  await helpers.organisation.getOrg.prefetch({ orgId: params.orgId });
  await helpers.member.getRole.prefetch({ orgId: params.orgId });
  const dehydrateState = dehydrate(helpers.queryClient);

  return (
    <HydrationBoundary state={dehydrateState}>
      <div className="container mt-24 flex min-h-screen flex-col gap-4  bg-base-100 bg-opacity-70 px-0 py-10">
        <OrganisationPageContent orgId={params.orgId} />
      </div>
    </HydrationBoundary>
  );
};

export default OrganisationPage;
