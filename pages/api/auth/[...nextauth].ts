// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const useSecureCookies = process.env.NEXTAUTH_URL?.startsWith("https://");
  const cookiePrefix = useSecureCookies ? "__Secure-" : "";
  const hostName = new URL(process.env.NEXTAUTH_URL || "http://localhost:3000")
    .hostname;
    
  // Get the request origin or referer to determine the source domain
  const origin = req.headers.origin || req.headers.referer || "";
  const requestHost = origin ? new URL(origin).hostname : "";
  
  // Determine if the request is coming from an allowed external domain
  const isExternalDomain = requestHost === "books.betaque.com";
  
  // Set cookie domain based on the request source
  const cookieDomain = isExternalDomain 
    ? ".betaque.com"  // Use root domain for sharing between subdomains
    : hostName === "localhost" ? "localhost" : undefined;

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
          sameSite: isExternalDomain ? "none" : "lax",
          path: "/",
          secure: useSecureCookies,
          domain: cookieDomain,
        },
      },
    },
  });
};

export default handler;
