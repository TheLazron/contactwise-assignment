"use client";

import { CaretSortIcon, DotsVerticalIcon } from "@radix-ui/react-icons";
import type { ColumnDef } from "@tanstack/react-table";
import { OrgObjectSchema } from "schemas";
import { z } from "zod";

export const columns: ColumnDef<z.infer<typeof OrgObjectSchema>>[] = [
  {
    accessorKey: "bannerImg",
    header: "",
    cell: ({ row }) => {
      const org = row.original;
      return (
        <img
          src={org.bannerImg}
          alt="org banner"
          className="h-8 w-8 rounded-md"
        />
      );
    },
  },
  {
    accessorKey: "orgName",
    header: ({ column }) => {
      return (
        <button
          className="btn"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Organisation Name
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </button>
      );
    },
  },
  {
    accessorKey: "owner",
    header: "Owner",
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
      const payment = row.original;

      return (
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
              <a>Item 1</a>
            </li>
            <li>
              <a>Item 2</a>
            </li>
          </ul>
        </div>
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
