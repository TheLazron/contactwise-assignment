"use client";

import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { membersTableDataType } from "types";
import { api } from "~/trpc/react";
import EditOrgModal from "./editOrgModal";
import DeleteOrgModal from "./deleteOrgModal";
import { TrashIcon } from "@radix-ui/react-icons";
import { MembersTable } from "./membersTable/dataTable";
import columns from "./membersTable/columns";

const OrganisationPageContent = ({ orgId }: { orgId: string }) => {
  const [columnsData, setColumnsData] = useState<membersTableDataType[]>([]);
  const { data: memberObject } = api.member.getRole.useQuery({ orgId });
  const { data } = api.organisation.getOrg.useQuery({ orgId });
  const [membersCount, setMembersCount] = useState<number>(0);
  if (!data || !memberObject) {
    notFound();
  }

  useEffect(() => {
    if (data) {
      const columnsData = data.members.map((m) => ({
        ...m,
        currentUser: {
          id: memberObject.id,
          role: memberObject.role,
          permissions: memberObject.permissions,
        },
      }));
      setColumnsData(columnsData);
    }
  }, [data]);

  //   useEffect(() => {
  //     if (data) {
  //       data.members
  //         .then((members) => {
  //           const columnsData = members.map((m) => ({
  //             ...m,
  //             currentUser: {
  //               id: memberObject.id,
  //               role: memberObject.role,
  //               permissions: memberObject.permissions,
  //             },
  //           }));
  //           setMembersCount(members.length);
  //           setColumnsData(columnsData);
  //         })
  //         .catch((err) => {
  //           console.error(err);
  //         });
  //     }
  //   });

  return (
    <>
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
            {memberObject.permissions.includes("EDIT_ORG") ? (
              <EditOrgModal
                orgId={orgId}
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
            <div className="flex items-center justify-start gap-2">
              <p>
                Member Count:{" "}
                <span className="font-bold text-primary">
                  {data.members.length}
                </span>
              </p>{" "}
              |{" "}
              <p>
                Joining Code:{" "}
                <span className="font-bold text-primary">{data.code}</span>
              </p>
            </div>
            {memberObject.role === "admin" ? (
              <DeleteOrgModal orgId={orgId}>
                <button className="btn btn-error btn-sm rounded-xl text-base-100">
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
          <div className="card-title items-end justify-between">
            <h1 className="text-4xl text-primary-content">Members</h1>
            <h2 className="text-lg text-primary-content">
              Your Role:{" "}
              <span className="text-secondary">
                {memberObject.role.toUpperCase()}
              </span>
            </h2>
          </div>
          <MembersTable columns={columns} data={columnsData} />
        </div>
      </div>
    </>
  );
};

export default OrganisationPageContent;
