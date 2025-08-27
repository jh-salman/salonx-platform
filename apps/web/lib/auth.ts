import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { salonxClient } from "@repo/sdk";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: "owner" | "member";
      orgId: string;
      brandId?: string;
    };
    accessToken: string;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: "owner" | "member";
    orgId: string;
    brandId?: string;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "owner" | "member";
    orgId: string;
    brandId?: string;
    accessToken: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await salonxClient.login({
            email: credentials.email,
            password: credentials.password,
          });

          if (response.success && response.data) {
            return {
              id: response.data.user.id,
              email: response.data.user.email,
              name: response.data.user.name,
              role: response.data.user.role,
              orgId: response.data.user.orgId,
              brandId: response.data.user.brandId,
              accessToken: response.data.accessToken,
            };
          }

          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.orgId = user.orgId;
        token.brandId = user.brandId;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.orgId = token.orgId;
      session.user.brandId = token.brandId;
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};
