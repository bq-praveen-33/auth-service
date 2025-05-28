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
    session: {
      maxAge: 60 * 60 * 24, // 1 days
      updateAge: 60 * 60 * 24, // 1 days
    },
    cookies: {
      sessionToken: {
        name: `${cookiePrefix}next-auth.session-token`,
        options: {
          httpOnly: true,
          sameSite: "none",
          path: "/",
          secure: true,
          domain: hostName === "localhost" ? "localhost" : undefined, // Let the browser handle the domain
        },
      },
    },
  });
};

export default handler;
