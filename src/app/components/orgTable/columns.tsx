"use client";

import { CaretRightIcon, TrashIcon } from "@radix-ui/react-icons";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { getOrganisationsResponseType } from "types";
import DeleteOrgModal from "../deleteOrgModal";

export const columns: ColumnDef<getOrganisationsResponseType>[] = [
  // {
  //   accessorKey: "bannerImg",
  //   header: "",
  //   cell: ({ row }) => {
  //     const org = row.original;
  //     return (
  //       <img
  //         src={org.bannerImg}
  //         alt="org banner"
  //         className="h-8 w-12 rounded-md object-cover"
  //       />
  //     );
  //   },
  // },
  {
    accessorKey: "name",
    header: "Organisation",
    cell: ({ row }) => {
      return <p className="font-semibold">{row.original.name}</p>;
    },
  },
  {
    accessorKey: "owner",
    header: "Owner",
    cell: ({ row }) => {
      return (
        <>
          <div className="flex items-center gap-2">
            <div className="avatar">
              <div className=" w-8 rounded-badge">
                <img
                  alt="owner_profile"
                  className="h-full w-full"
                  src={row.original.owner.image!}
                />
              </div>
            </div>

            <p>{row.original.owner.name}</p>
          </div>
        </>
      );
    },
  },
  {
    accessorKey: "memberCount",
    header: "Members",
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const data = row.original;
      return data.currentUserId === data.owner.id ? (
        <DeleteOrgModal orgId={data.id}>
          <button className="  btn btn-circle btn-error btn-sm">
            <TrashIcon />
          </button>
        </DeleteOrgModal>
      ) : null;
    },
  },
  {
    id: "actions",
    header: "View Org",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <Link
          href={`/organisation/${row.original.id}`}
          className="btn btn-circle btn-primary btn-sm"
        >
          <CaretRightIcon />
        </Link>
      );
    },
  },
];
