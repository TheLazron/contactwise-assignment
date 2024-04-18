import { Pencil1Icon } from "@radix-ui/react-icons";
import { columns } from "~/app/components/membersTable/columns";
import { MembersTable } from "~/app/components/membersTable/dataTable";
import { api } from "~/trpc/server";

const OrganisationPage = async ({ params }: { params: { orgId: string } }) => {
  const data = await api.organisation.getOrg({ orgId: params.orgId });
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
            <button className="btn btn-circle btn-sm">
              <Pencil1Icon />
            </button>
          </div>
          <p className="italic">{data.description}</p>
          <div className="card-actions justify-end">
            <p>
              Member Count:{" "}
              <span className="font-bold text-primary">{members.length}</span>
            </p>
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
