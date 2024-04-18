/* eslint-disable @next/next/no-img-element */
"use client";

import { DotsVerticalIcon } from "@radix-ui/react-icons";
import type { ColumnDef } from "@tanstack/react-table";
import type { membersTableDataType } from "types";

export const columns: ColumnDef<membersTableDataType>[] = [
  {
    accessorKey: "image",
    header: "Profile",
    cell: ({ row }) => {
      const member = row.original;
      return (
        <div className="avatar">
          <div className="h-10 w-10 rounded-badge ring-2 ring-primary">
            <img
              src={member.user.image!}
              alt="org banner"
              className=" object-cover"
            />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "User Name",
    cell: ({ row }) => {
      return (
        <p className="font-semibold text-accent">{row.original.user.name}</p>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return row.original.user.email;
    },
  },
  {
    accessorKey: "joinedOn",
    header: "Joined On",
    cell: ({ row }) => {
      const date = new Date(row.original.joinedOn);
      return date.toDateString();
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role as string;
      return (
        <p className="font-semibold text-accent">
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </p>
      );
    },
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
