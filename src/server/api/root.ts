import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { organisationRouter } from "./routers/organisation";
import { userRouter } from "./routers/user";
import { memeberRouter } from "./routers/member";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
//group different tRPC routers together
export const appRouter = createTRPCRouter({
  auth: authRouter,
  organisation: organisationRouter,
  user: userRouter,
  member: memeberRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
