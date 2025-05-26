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
      maxAge: 5 * 60, // 5 minutes
      updateAge: 5 * 60, // 5 minutes
    },
    cookies: {
      sessionToken: {
        name: `${cookiePrefix}next-auth.session-token`,
        options: {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure: useSecureCookies,
          domain:
            hostName === "localhost"
              ? "localhost"
              : process.env.NEXT_PUBLIC_DOMAIN_WHITELIST,
        },
      },
    },
  });
};

export default handler;
