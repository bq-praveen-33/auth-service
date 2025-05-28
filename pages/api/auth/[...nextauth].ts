// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const useSecureCookies = process.env.NEXTAUTH_URL?.startsWith("https://");
  const cookiePrefix = useSecureCookies ? "__Secure-" : "";
  const hostName = new URL(process.env.NEXTAUTH_URL || "http://localhost:3000")
    .hostname;

  return NextAuth(req, res, {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID || "GOOGLE_CLIENT_ID",
        clientSecret:
          process.env.GOOGLE_CLIENT_SECRET || "GOOGLE_CLIENT_SECRET",
      }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    debug: true,
    callbacks: {
      async signIn({ user, account, profile, email, credentials }) {
        console.log('Sign in callback:', { user, account, profile });
        return true;
      },
      async jwt({ token, user, account, profile }) {
        console.log('JWT callback:', { token, user, account });
        // Pass user info to token on first sign in
        if (account && user) {
          token.email = user.email;
          token.name = user.name;
          token.picture = user.image;
        }
        return token;
      },
      async session({ session, token }) {
        console.log('Session callback:', { session, token });
        // Pass token info to session
        if (token) {
          session.user = {
            email: token.email,
            name: token.name,
            image: token.picture,
          };
        }
        return session;
      }
    },
    session: {
      strategy: "jwt",
      maxAge: 60 * 60 * 24, // 1 day
    },
    cookies: {
      sessionToken: {
        name: `${cookiePrefix}next-auth.session-token`,
        options: {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure: useSecureCookies,
          domain: hostName === "localhost" ? "localhost" : `.${hostName}`,
        },
      },
    },
  });
};

export default handler;
