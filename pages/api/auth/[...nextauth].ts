// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Get origin from request to support multiple domains
  const origin = req.headers.origin || '';
  const allowedOrigins = ['https://books.betaque.com', 'http://localhost:3000','http://localhost:3001'];
  
  if (origin && allowedOrigins.includes(origin)) {
    // Add CORS headers to support cross-origin requests
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Check if we're running in development
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Detect if we're using HTTPS
  const useSecureCookies = process.env.NEXTAUTH_URL?.startsWith("https://") && !isDevelopment;
  const cookiePrefix = useSecureCookies ? "__Secure-" : "";

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
          // Use 'lax' for same-origin and 'none' for cross-origin
          sameSite: isDevelopment ? "lax" : "none",
          path: "/",
          // In development, don't require secure; in production, always require secure
          secure: !isDevelopment,
        },
      },
    },
    // Add debug mode to see what's happening
    debug: isDevelopment,
  });
};

export default handler;
