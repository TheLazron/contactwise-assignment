import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { env } from "~/env";
import { db } from "~/server/db";
import { sendMailRequest } from "./nodemailer";
import { LoginSchema } from "schemas/authSchemas";
import { generateVerificationToken } from "~/lib/verification-token";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  //custom pages implemented
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
  },
  //jet session for both providers
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    //check for verified account
    signIn: async ({ user, account }) => {
      if (account?.provider != "credentials") return true;

      const existingUser = await db.user.findFirst({
        where: { email: user.email },
      });
      if (!existingUser) return false;
      if (!existingUser.emailVerified) {
        const token = await generateVerificationToken(existingUser.email!);
        await sendMailRequest(existingUser.email!, token.token, "verification");

        return false;
      }

      return true;
    },

    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },
    session: ({ session, token, user }) => {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, req) => {
        const userData = LoginSchema.safeParse(credentials);
        if (userData.success) {
          const { email, password } = userData.data;
          const user = await db.user.findFirst({
            where: { email },
          });
          if (!user) return null;
          const isValidPass = await bcrypt.compare(password, user.password!);
          if (!isValidPass) return null;
          return user;
        }
        return null;
      },
    }),
  ],
};
//helper function to get server session with options
export const getServerAuthSession = () => getServerSession(authOptions);
