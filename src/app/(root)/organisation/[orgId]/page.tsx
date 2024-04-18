import { TrashIcon } from "@radix-ui/react-icons";
import { getServerSession } from "next-auth";
import DeleteOrgModal from "~/app/components/deleteOrgModal";
import EditOrgModal from "~/app/components/editOrgModal";
import columns from "~/app/components/membersTable/columns";
import { MembersTable } from "~/app/components/membersTable/dataTable";
import { authOptions } from "~/server/auth";
import { api } from "~/trpc/server";

const OrganisationPage = async ({ params }: { params: { orgId: string } }) => {
  const memberObject = await api.member.getRole({ orgId: params.orgId });
  const data = await api.organisation.getOrg({ orgId: params.orgId });
  if (memberObject.role === "admin") {
  }

  let members = await data.members;
  members = members.map((m) => m);
  return (
    <div className="container mt-24 flex min-h-screen flex-col gap-4  bg-base-100 bg-opacity-70 px-0 py-10">
      <div className="card card-compact relative h-44 w-full overflow-hidden bg-base-100 shadow-xl ">
        <div className="absolute z-0 h-full w-full">
          <img
            className="h-full w-full object-cover"
            src={data.bannerImg}
            alt="Shoes"
          />
        </div>
        <div className="absolute h-full w-full bg-black bg-opacity-55"></div>
        <div className="card-body z-20 text-base-100 ">
          <div className="card-title justify-between">
            <h1 className="">{data.name}</h1>
            {memberObject.role === "admin" ||
            memberObject.role === "manager" ? (
              <EditOrgModal
                orgId={params.orgId}
                initialData={{
                  bannerImg: data.bannerImg,
                  description: data.description,
                  name: data.name,
                }}
              />
            ) : null}
          </div>
          <p className="italic">{data.description}</p>
          <div className="card-actions items-end justify-between">
            <p>
              Member Count:{" "}
              <span className="font-bold text-primary">{members.length}</span>
            </p>
            {memberObject.role === "admin" ? (
              <DeleteOrgModal orgId={params.orgId}>
                <button className="btn btn-error btn-sm rounded-xl">
                  <TrashIcon className=" text-base-100" />
                  Delete
                </button>
              </DeleteOrgModal>
            ) : null}
          </div>
        </div>
      </div>
      <div className="card card-compact flex-1 shadow-xl">
        <div className="card-body">
          <div className="card-title justify-between">
            <h1 className="text-4xl text-primary-content">Members</h1>
          </div>
          <MembersTable columns={columns} data={members} />
        </div>
      </div>
    </div>
  );
};

export default OrganisationPage;
