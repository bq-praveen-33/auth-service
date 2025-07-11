// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Get origin from request to support multiple domains
  const origin = req.headers.origin || '';
  const allowedOrigins = ['https://books.betaque.com', 'http://localhost:3000', 'http://localhost:3001'];
  
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
  const isDevelopment = process.env.NODE_ENV === 'development' || origin.includes('localhost');
  
  // Detect if we're using HTTPS
  const useSecureCookies = !isDevelopment;
  const cookiePrefix = useSecureCookies ? "__Secure-" : "";

  // Determine cookie domain based on environment
  let cookieDomain;
  const hostName = new URL(process.env.NEXTAUTH_URL || "http://localhost:3000").hostname;
  
  if (hostName.includes('betaque.com')) {
    // In production on betaque.com domain
    cookieDomain = '.betaque.com'; // Shared domain for all betaque.com subdomains
  } else if (hostName === 'localhost' || isDevelopment) {
    // In development on localhost
    cookieDomain = 'localhost';
  }

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
          sameSite: isDevelopment ? "lax" : "none", // Use lax for localhost, none for cross-domain
          path: "/",
          secure: useSecureCookies, // Must be secure in production
          domain: cookieDomain, // Set domain appropriately
        },
      },
    },
    // Add debug mode to see what's happening
    debug: isDevelopment,
  });
};

export default handler;
