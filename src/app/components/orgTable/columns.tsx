"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { OrgObjectSchema } from "schemas";
import { z } from "zod";

export const columns: ColumnDef<z.infer<typeof OrgObjectSchema>>[] = [
  {
    accessorKey: "bannerImg",
    header: "",
  },
  {
    accessorKey: "orgName",
    header: "Organization Name",
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
    accessorKey: "actions",
    header: "Actions",
  },
];
