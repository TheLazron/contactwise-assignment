import "server-only";

import { headers } from "next/headers";
import { cache } from "react";

import { appRouter, createCaller } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import SuperJSON from "superjson";
import { createServerSideHelpers } from "@trpc/react-query/server";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(() => {
  const heads = new Headers(headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: heads,
  });
});

export const api = createCaller(createContext);
//SSRHelper to to prefetch data
export const createSSRHelper = async () =>
  createServerSideHelpers({
    router: appRouter,
    transformer: SuperJSON,
    ctx: await createContext(),
  });
