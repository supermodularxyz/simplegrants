import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { SessionStrategy } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import prisma from "../../../lib/prismadb";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    // ...add more providers here
  ],
  callbacks: {
    async session({ session, token, user }: any) {
      // Adding the user ID here so we can retrieve the user in the backend
      session.user.id = user?.id;

      return session;
    },
  },
};
export default NextAuth(authOptions);
