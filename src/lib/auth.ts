/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password harus diisi");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Email atau password salah");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Email atau password salah");
        }

        return {
          id: user.id,
          email: user.email || "",
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      // Fetch user role from database
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true, campusId: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.campusId = dbUser.campusId;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.campusId = token.campusId as string | null;
      }
      return session;
    },
    async signIn({ user, account }) {
      // Allow sign in
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Menghandle redirect setelah login/logout
      // Jika callback URL adalah baseUrl atau root, redirect berdasarkan role
      if (url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/auth/login`;
      }

      // Jika URL dimulai dengan baseUrl, gunakan URL tersebut
      if (url.startsWith(baseUrl)) {
        return url;
      }

      // Jika URL relatif, tambahkan baseUrl
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      return baseUrl;
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export const authHandler = NextAuth(authOptions);
