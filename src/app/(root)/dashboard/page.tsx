import type { OrgObjectSchema } from "schemas";
import { columns } from "../../components/orgTable/columns";
import { DataTable } from "../../components/orgTable/dataTable";
import { z } from "zod";
import { NavigationMenuDemo } from "~/app/components/orgAction";

async function getData(): Promise<z.infer<typeof OrgObjectSchema>[]> {
  return [
    {
      orgName: "Organization 1",
      owner: "Owner 1",
      memberCount: 10,
      bannerImg:
        "https://images.unsplash.com/photo-1712839398257-8f7ee9127998?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      orgName: "Organization 2",
      owner: "Owner 2",
      memberCount: 20,
      bannerImg:
        "https://images.unsplash.com/photo-1712839398257-8f7ee9127998?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];
}

const DashboardPage = async () => {
  const data = await getData();
  return (
    <div className="container mt-24 flex min-h-screen flex-col  bg-base-100 bg-opacity-70 px-0 py-10">
      <div className="flex w-full justify-end">
        <NavigationMenuDemo />
      </div>
      <div className="mt-12 flex w-full flex-col gap-3">
        <div>
          <h1 className="lg:text-md mb-2 w-full text-[14px] font-bold leading-tight tracking-tight text-accent sm:text-[16px] md:text-[20px]">
            Created Organisations
          </h1>
          <DataTable columns={columns} data={data} />
        </div>
        <div>
          <h1 className=" lg:text-md mb-2 w-full text-[14px] font-bold leading-tight tracking-tight text-accent sm:text-[16px] md:text-[20px]">
            Joined Organisations
          </h1>
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
