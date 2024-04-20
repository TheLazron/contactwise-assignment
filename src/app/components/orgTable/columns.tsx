"use client";

import { Organisation } from "@prisma/client";
import {
  CaretRightIcon,
  CaretSortIcon,
  DotsVerticalIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { OrgObjectSchema } from "schemas";
import { getOrganisationsResponseType } from "types";
import { z } from "zod";
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
        <div className="dropdown dropdown-end dropdown-left">
          <div
            tabIndex={0}
            role="button"
            className="btn-sm m-1 flex items-center justify-center"
          >
            <DotsVerticalIcon className="h-4 " />
          </div>
          <ul
            tabIndex={0}
            className="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow"
          >
            <li>
              <DeleteOrgModal orgId={data.id}>
                <>
                  <TrashIcon />
                  Delete
                </>
              </DeleteOrgModal>
            </li>
          </ul>
        </div>
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

// <DropdownMenu>
//   <DropdownMenuTrigger asChild>
//     <Button variant="ghost" className="h-8 w-8 p-0">
//       <span className="sr-only">Open menu</span>
//       <DotsHorizontalIcon className="h-4 w-4" />
//     </Button>
//   </DropdownMenuTrigger>
//   <DropdownMenuContent align="end">
//     <DropdownMenuLabel>Actions</DropdownMenuLabel>
//     <DropdownMenuItem
//       onClick={() => navigator.clipboard.writeText(payment.id)}
//     >
//       Copy payment ID
//     </DropdownMenuItem>
//     <DropdownMenuSeparator />
//     <DropdownMenuItem>View customer</DropdownMenuItem>
//     <DropdownMenuItem>View payment details</DropdownMenuItem>
//   </DropdownMenuContent>
// </DropdownMenu>
