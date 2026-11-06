import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
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

        const email = String(credentials.email).toLowerCase().trim();
        const password = String(credentials.password);

        try {
          const admin = await prisma.adminUser.findUnique({ where: { email, isActive: true } });
          if (!admin) return null;

          const passwordMatch = await bcrypt.compare(password, admin.passwordHash);
          if (!passwordMatch) return null;

          // Update last login
          await prisma.adminUser.update({
            where: { id: admin.id },
            data: { lastLoginAt: new Date() },
          });

          return { id: admin.id, email: admin.email, name: admin.name };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 }, // 8 hours
  pages: { signIn: "/admin/login" },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.adminId = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.adminId) (session.user as any).adminId = token.adminId;
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});
