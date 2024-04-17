import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { env } from "~/env";
import { db } from "~/server/db";
import { sendMailRequest } from "./nodemailer";
import { LoginSchema } from "schemas";
import { generateVerificationToken } from "~/lib/verification-token";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
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
    jwt: async ({ token, user, account, session }) => {
      console.log("jwt user", user);
      console.log("jwt account", account);
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
        session = {
          ...session,
          user: {
            ...session.user,
            id: token.id as string,
            email: token.email,
            name: token.name,
            image: token.image as string,
          },
        };
      }
      console.log("inside session callback", session);
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
          console.log({ user });
          const isValidPass = await bcrypt.compare(password, user.password!);
          console.log({ isValidPass });
          if (!isValidPass) return null;
          return user;
        }
        return null;
      },
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
